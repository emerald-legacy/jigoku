const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const { logger } = require('./logger');
const bcrypt = require('bcrypt');
const api = require('./api');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const { rateLimit } = require('express-rate-limit');
const monk = require('monk').default;
const _ = require('underscore');

const UserService = require('./services/UserService.js');
const Settings = require('./settings.js');
const { errorHandler, requestHandler } = require('./ErrorMonitoring');
const env = require('./env.js');

// Rate limiting configuration
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 auth attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts, please try again later' }
});

class Server {
    constructor(isDeveloping) {
        let db = monk(env.dbPath);
        this.userService = new UserService(db);
        this.isDeveloping = isDeveloping;
        // @ts-ignore
        this.server = http.Server(app);
    }

    init() {
        if (!this.isDeveloping) {
            app.use(requestHandler);
            app.use(errorHandler);
        }

        // Security headers with Helmet v7
        app.use(
            // @ts-ignore - helmet v7 types don't match CommonJS import pattern
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ["'self'"],
                        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                        styleSrc: ["'self'", "'unsafe-inline'"],
                        imgSrc: ["'self'", 'data:', 'https:'],
                        connectSrc: ["'self'", 'wss:', 'ws:'],
                        fontSrc: ["'self'", 'data:'],
                        objectSrc: ["'none'"],
                        upgradeInsecureRequests: env.https === 'true' ? [] : null
                    }
                },
                crossOriginEmbedderPolicy: false, // Needed for Socket.io compatibility
                hsts: {
                    maxAge: 31536000,
                    includeSubDomains: true,
                    preload: true
                }
            })
        );

        // CORS configuration
        app.use(
            cors({
                origin: env.domain ? [env.domain, `https://${env.domain}`, `http://${env.domain}`] : true,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
                allowedHeaders: ['Content-Type', 'Authorization']
            })
        );

        app.set('trust proxy', 1);
        app.use(
            session({
                store: new MongoStore({ mongoUrl: env.dbPath }),
                saveUninitialized: false,
                resave: false,
                secret: env.secret,
                cookie: {
                    maxAge: env.cookieLifetime,
                    secure: env.https === 'true',
                    httpOnly: true, // SECURITY FIX: Prevent XSS access to cookies
                    sameSite: 'lax',
                    domain: env.domain
                },
                name: 'sessionId'
            })
        );

        app.use(passport.initialize());
        app.use(passport.session());

        passport.use(new localStrategy(this.verifyUser.bind(this)));
        passport.serializeUser(this.serializeUser.bind(this));
        passport.deserializeUser(this.deserializeUser.bind(this));

        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));

        // Apply rate limiting to API routes
        app.use('/api/', apiLimiter);
        app.use('/api/account/login', authLimiter);
        app.use('/api/account/register', authLimiter);

        api.init(app);

        app.use(express.static(__dirname + '/../public'));
        app.set('view engine', 'pug');
        app.set('views', path.join(__dirname, '..', 'views'));

        // Health check endpoint
        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: Date.now(),
                uptime: process.uptime()
            });
        });

        app.get('*', (req, res) => {
            let token = undefined;

            if (req.user) {
                token = jwt.sign(req.user, env.secret);
                req.user = _.omit(req.user, 'blockList');
            }

            res.render('index', {
                basedir: path.join(__dirname, '..', 'views'),
                user: Settings.getUserWithDefaultsSet(req.user),
                token: token,
                production: !this.isDeveloping
            });
        });

        // Define error middleware last
        app.use(function (err, req, res) {
            // eslint-disable-line no-unused-vars
            res.status(500).send({ success: false });
            logger.error(err);
        });

        return this.server;
    }

    run() {
        var port = env.lobbyPort;

        this.server.listen(port, '127.0.0.1', function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info('==> ?? Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
        });
    }

    async verifyUser(username, password, done) {
        try {
            const user = await this.userService.getUserByUsername(username);

            if (!user) {
                return done(null, false, { message: 'Invalid username/password' });
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return done(null, false, { message: 'Invalid username/password' });
            }

            const userObj = Settings.getUserWithDefaultsSet({
                username: user.username,
                email: user.email,
                emailHash: user.emailHash,
                _id: user._id,
                admin: user.admin,
                settings: user.settings,
                promptedActionWindows: user.promptedActionWindows,
                permissions: user.permissions,
                blockList: user.blockList
            });

            return done(null, userObj);
        } catch (err) {
            logger.error('Authentication error:', err);
            return done(err);
        }
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user._id);
        }
    }

    deserializeUser(id, done) {
        this.userService.getUserById(id).then((user) => {
            if (!user) {
                return done(new Error('user not found'));
            }

            let userObj = {
                username: user.username,
                email: user.email,
                emailHash: user.emailHash,
                _id: user._id,
                admin: user.admin,
                settings: user.settings,
                promptedActionWindows: user.promptedActionWindows,
                permissions: user.permissions,
                blockList: user.blockList
            };

            done(null, userObj);
        });
    }
}
module.exports = Server;
