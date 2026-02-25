const socketio = require('socket.io');
const Socket = require('./socket.js');
const jwt = require('jsonwebtoken');
const { differenceInSeconds } = require('date-fns');

const { logger } = require('./logger');
const version = new Date(require('../version.js'));
const PendingGame = require('./pendinggame.js');
const GameRouter = require('./gamerouter.js');
const MessageService = require('./services/MessageService.js');
const DeckService = require('./services/DeckService.js');
const CardService = require('./services/CardService.js');
const Settings = require('./settings.js');
const env = require('./env.js');

class Lobby {
    constructor(server, options = {}) {
        this.sockets = {};
        this.users = {};
        this.games = {};
        this.messageService = options.messageService || new MessageService(options.db);
        this.deckService = options.deckService || new DeckService(options.db);
        this.cardService = options.cardService || new CardService(options.db);
        this.router = options.router || new GameRouter();
        this.titleCardData = null;

        this.router.on('onGameClosed', this.onGameClosed.bind(this));
        this.router.on('onPlayerLeft', this.onPlayerLeft.bind(this));
        this.router.on('onWorkerTimedOut', this.onWorkerTimedOut.bind(this));
        this.router.on('onNodeReconnected', this.onNodeReconnected.bind(this));
        this.router.on('onWorkerStarted', this.onWorkerStarted.bind(this));

        this.io = options.io || new socketio.Server(server, {
            perMessageDeflate: false,
            pingTimeout: 30000,
            pingInterval: 25000,
            cors: {
                origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
                credentials: true
            }
        });
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));

        this.lastUserBroadcast = new Date();

        this.loadCardData();

        setInterval(() => this.clearStaleGames(), 60 * 1000);
    }

    async loadCardData() {
        this.shortCardData = await this.cardService.getAllCards({ shortForm: true });
    }

    // External methods
    getStatus() {
        var nodeStatus = this.router.getNodeStatus();

        return nodeStatus;
    }

    disableNode(nodeName) {
        return this.router.disableNode(nodeName);
    }

    enableNode(nodeName) {
        return this.router.enableNode(nodeName);
    }

    debugDump() {
        var games = Object.values(this.games).map((game) => {
            var players = Object.values(game.players).map((player) => {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id
                };
            });

            var spectators = Object.values(game.spectators).map((spectator) => {
                return {
                    name: spectator.name,
                    id: spectator.id
                };
            });

            return {
                name: game.name,
                players: players,
                spectators: spectators,
                id: game.id,
                started: game.started,
                node: game.node ? game.node.identity : 'None',
                startedAt: game.createdAt
            };
        });

        var nodes = this.router.getNodeStatus();

        return {
            games: games,
            nodes: nodes,
            socketCount: Object.keys(this.sockets).length,
            userCount: Object.keys(this.users).length
        };
    }

    // Helpers
    findGameForUser(user) {
        return Object.values(this.games).find((game) => {
            if(game.spectators[user]) {
                return true;
            }

            var player = game.players[user];

            if(!player || player.left) {
                return false;
            }

            return true;
        });
    }

    getUserList() {
        let userList = Object.values(this.users).map(function (user) {
            return {
                name: user.username,
                emailHash: user.emailHash,
                noAvatar: user.settings.disableGravatar
            };
        });

        userList = [...userList].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        return userList;
    }

    handshake(socket, next) {
        var versionInfo = undefined;

        // Socket.io v4 uses auth object, v1 used query string
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if(token && token !== 'undefined') {
            jwt.verify(token, env.secret, function (err, user) {
                if(err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        const clientVersion = socket.handshake.auth?.version || socket.handshake.query?.version;
        if(clientVersion) {
            versionInfo = new Date(clientVersion);
        }

        if(!versionInfo || versionInfo < version) {
            socket.emit(
                'banner',
                'Your client version is out of date, please refresh or clear your cache to get the latest version'
            );
        }

        next();
    }

    // Actions
    filterGameListWithBlockList(user) {
        if(!user) {
            return this.games;
        }

        return Object.values(this.games).filter((game) => {
            let userBlockedByOwner = game.isUserBlocked(user);
            let userHasBlockedPlayer = Object.values(game.players).some((player) =>
                user.blockList.includes(player.name.toLowerCase())
            );
            return !userBlockedByOwner && !userHasBlockedPlayer;
        });
    }

    mapGamesToGameSummaries(games) {
        const gamesArray = Array.isArray(games) ? games : Object.values(games);
        return gamesArray
            .map((game) => game.getSummary())
            .sort((a, b) => a.createdAt - b.createdAt)
            .reverse()
            .sort((a, b) => (a.started === b.started ? 0 : a.started ? 1 : -1));
    }

    sendUserListFilteredWithBlockList(socket, userList) {
        let filteredUsers = userList;

        if(socket.user) {
            filteredUsers = userList.filter((user) => {
                return !socket.user.blockList.includes(user.name.toLowerCase());
            });
        }

        socket.send('users', filteredUsers);
    }

    broadcastGameList(socket) {
        let sockets = socket ? [socket] : Object.values(this.sockets);
        sockets.forEach((s) => {
            let filteredGames = this.filterGameListWithBlockList(s.user);
            let gameSummaries = this.mapGamesToGameSummaries(filteredGames);
            s.send('games', gameSummaries);
        });
    }

    broadcastUserList() {
        var now = new Date();

        if(differenceInSeconds(now, this.lastUserBroadcast) < 60) {
            return;
        }

        this.lastUserBroadcast = new Date();

        let users = this.getUserList();

        Object.values(this.sockets).forEach((socket) => {
            this.sendUserListFilteredWithBlockList(socket, users);
        });
    }

    sendGameState(game) {
        if(game.started) {
            return;
        }

        Object.values(game.getPlayersAndSpectators()).forEach((player) => {
            if(!this.sockets[player.id]) {
                logger.info('Wanted to send to ', player.id, ' but have no socket');
                return;
            }

            this.sockets[player.id].send('gamestate', game.getSummary(player.name));
        });
    }

    clearGamesForNode(nodeName) {
        Object.values(this.games).forEach((game) => {
            if(game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        });

        this.broadcastGameList();
    }

    clearStaleGames() {
        let now = Date.now();
        const timeout = 60 * 60 * 1000;
        let stalePendingGames = Object.values(this.games).filter((game) => !game.started && now - game.createdAt > timeout);
        let emptyGames = Object.values(this.games).filter(
            (game) => game.started && now - game.createdAt > timeout && Object.keys(game.getPlayers()).length === 0
        );

        stalePendingGames.forEach((game) => {
            logger.info('closed pending game', game.id, 'due to inactivity');
            delete this.games[game.id];
        });

        emptyGames.forEach((game) => {
            logger.info('closed started game', game.id, 'due to no active players');
            delete this.games[game.id];
            this.router.closeGame(game);
        });

        if(emptyGames.length > 0 || stalePendingGames.length > 0) {
            this.broadcastGameList();
        }
    }

    // Events
    onConnection(ioSocket) {
        var socket = new Socket(ioSocket);

        socket.registerEvent('lobbychat', this.onLobbyChat.bind(this));
        socket.registerEvent('newgame', this.onNewGame.bind(this));
        socket.registerEvent('joingame', this.onJoinGame.bind(this));
        socket.registerEvent('leavegame', this.onLeaveGame.bind(this));
        socket.registerEvent('watchgame', this.onWatchGame.bind(this));
        socket.registerEvent('startgame', this.onStartGame.bind(this));
        socket.registerEvent('chat', this.onPendingGameChat.bind(this));
        socket.registerEvent('selectdeck', this.onSelectDeck.bind(this));
        socket.registerEvent('connectfailed', this.onConnectFailed.bind(this));
        socket.registerEvent('removegame', this.onRemoveGame.bind(this));

        socket.on('authenticate', this.onAuthenticated.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));

        this.sockets[ioSocket.id] = socket;

        if(socket.user) {
            this.users[socket.user.username] = Settings.getUserWithDefaultsSet(socket.user);

            this.broadcastUserList();
        }

        // Force user list send for the newly connected socket, bypassing the throttle
        this.sendUserListFilteredWithBlockList(socket, this.getUserList());

        this.messageService.getLastMessages().then((messages) => {
            socket.send('lobbymessages', messages.reverse());
        });

        this.broadcastGameList(socket);

        if(!socket.user) {
            return;
        }

        var game = this.findGameForUser(socket.user.username);
        if(game && game.started) {
            socket.send('handoff', {
                address: game.node.address,
                port: game.node.port,
                protocol: game.node.protocol,
                name: game.node.identity,
                gameId: game.id
            });
        }
    }

    onAuthenticated(socket, user) {
        let userWithDefaults = Settings.getUserWithDefaultsSet(user);
        this.users[user.username] = userWithDefaults;

        this.broadcastUserList();
    }

    onSocketDisconnected(socket, reason) {
        if(!socket) {
            return;
        }

        delete this.sockets[socket.id];

        if(!socket.user) {
            return;
        }

        delete this.users[socket.user.username];

        logger.info('user \'%s\' disconnected from the lobby: %s', socket.user.username, reason);

        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onNewGame(socket, gameDetails) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        let game = new PendingGame(socket.user, gameDetails);
        game.newGame(socket.id, socket.user, gameDetails.password, (err, message) => {
            if(err) {
                logger.info('game failed to create', err, message);

                return;
            }

            socket.joinChannel(game.id);
            this.sendGameState(game);

            this.games[game.id] = game;
            this.broadcastGameList();
        });
    }

    onJoinGame(socket, gameId, password) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        game.join(socket.id, socket.user, password, (err, message) => {
            if(err) {
                socket.send('passworderror', message);

                return;
            }

            socket.joinChannel(game.id);

            this.sendGameState(game);

            this.broadcastGameList();
        });
    }

    onStartGame(socket, gameId) {
        var game = this.games[gameId];

        if(!game || game.started) {
            return;
        }

        if(
            Object.values(game.getPlayers()).some(function (player) {
                return !player.deck;
            })
        ) {
            return;
        }

        if(!game.isOwner(socket.user.username)) {
            return;
        }

        var gameNode = this.router.startGame(game);
        if(!gameNode) {
            return;
        }

        game.node = gameNode;
        game.started = true;

        this.broadcastGameList();

        this.io.to(game.id).emit('handoff', {
            address: gameNode.address,
            port: gameNode.port,
            protocol: game.node.protocol,
            name: game.node.identity
        });
    }

    onWatchGame(socket, gameId, password) {
        var existingGame = this.findGameForUser(socket.user.username);
        if(existingGame) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        game.watch(socket.id, socket.user, password, (err, message) => {
            if(err) {
                socket.send('passworderror', message);

                return;
            }

            socket.joinChannel(game.id);

            if(game.started) {
                this.router.addSpectator(game, socket.user);
                socket.send('handoff', {
                    address: game.node.address,
                    port: game.node.port,
                    protocol: game.node.protocol,
                    name: game.node.identity
                });
            } else {
                this.sendGameState(game);
            }
        });
    }

    onLeaveGame(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.leave(socket.user.username);
        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            delete this.games[game.id];
        } else {
            this.sendGameState(game);
        }

        this.broadcastGameList();
    }

    onPendingGameChat(socket, message) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        game.chat(socket.user.username, message);
        this.sendGameState(game);
    }

    onLobbyChat(socket, message) {
        var chatMessage = {
            user: {
                username: socket.user.username,
                emailHash: socket.user.emailHash,
                noAvatar: socket.user.settings.disableGravatar
            },
            message: message,
            time: new Date()
        };

        Object.values(this.sockets).forEach((s) => {
            if(s.user && s.user.blockList.includes(chatMessage.user.username.toLowerCase())) {
                return;
            }

            s.send('lobbychat', chatMessage);
        });

        this.messageService.addMessage(chatMessage);
    }

    onSelectDeck(socket, gameId, deckId) {
        if(typeof deckId === 'object' && deckId !== null) {
            deckId = deckId._id;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        Promise.all([this.cardService.getAllCards(), this.cardService.getAllPacks(), this.deckService.getById(deckId)])
            .then((results) => {
                let [cards, , deck] = results;

                if(deck.stronghold) {
                    deck.stronghold.forEach((stronghold) => {
                        stronghold.card = cards[stronghold.card.id];
                    });
                }

                if(deck.role) {
                    deck.role.forEach((role) => {
                        role.card = cards[role.card.id];
                    });
                }

                if(deck.provinceCards) {
                    deck.provinceCards.forEach((province) => {
                        province.card = cards[province.card.id];
                    });
                }

                if(deck.conflictCards) {
                    deck.conflictCards.forEach((conflict) => {
                        conflict.card = cards[conflict.card.id];
                    });
                }

                if(deck.dynastyCards) {
                    deck.dynastyCards.forEach((dynasty) => {
                        dynasty.card = cards[dynasty.card.id];
                    });
                }

                game.selectDeck(socket.user.username, deck);

                this.sendGameState(game);
            })
            .catch((err) => {
                logger.info(err);

                return;
            });
    }

    onConnectFailed(socket) {
        var game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        logger.info('user \'%s\' failed to handoff to game server', socket.user.username);
        this.router.notifyFailedConnect(game, socket.user.username);
    }

    onRemoveGame(socket, gameId) {
        if(!socket.user.admin) {
            return;
        }

        var game = this.games[gameId];
        if(!game) {
            return;
        }

        logger.info(socket.user.username, 'closed game', game.id, '(' + game.name + ') forcefully');

        if(!game.started) {
            delete this.games[game.id];
        } else {
            this.router.closeGame(game);
        }
    }

    // router Events
    onGameClosed(gameId) {
        var game = this.games[gameId];

        if(!game) {
            return;
        }

        delete this.games[gameId];

        this.broadcastGameList();
    }

    onPlayerLeft(gameId, player) {
        var game = this.games[gameId];

        if(!game) {
            return;
        }

        game.leave(player);

        if(game.isEmpty()) {
            delete this.games[gameId];
        }

        this.broadcastGameList();
    }

    onWorkerTimedOut(nodeName) {
        this.clearGamesForNode(nodeName);
    }

    onWorkerStarted(nodeName) {
        this.router.sendCommand(nodeName, 'CARDDATA', {
            titleCardData: this.titleCardData,
            shortCardData: this.shortCardData
        });
    }

    onNodeReconnected(nodeName, games) {
        games.forEach((game) => {
            let syncGame = new PendingGame(
                { username: game.owner },
                { spectators: game.allowSpectators, name: game.name }
            );
            syncGame.id = game.id;
            syncGame.node = this.router.workers[nodeName];
            syncGame.createdAt = game.startedAt;
            syncGame.started = game.started;
            syncGame.gameType = game.gameType;
            syncGame.password = game.password;

            Object.values(game.players).forEach((player) => {
                syncGame.players[player.name] = {
                    id: player.id,
                    name: player.name,
                    emailHash: player.emailHash,
                    owner: game.owner === player.name,
                    faction: { cardData: { code: player.faction } }
                };
            });

            Object.values(game.spectators).forEach((player) => {
                syncGame.spectators[player.name] = {
                    id: player.id,
                    name: player.name,
                    emailHash: player.emailHash
                };
            });

            this.games[syncGame.id] = syncGame;
        });

        Object.values(this.games).forEach((game) => {
            if(
                game.node &&
                game.node.identity === nodeName &&
                games.find((nodeGame) => {
                    return nodeGame.id === game.id;
                })
            ) {
                this.games[game.id] = game;
            } else if(game.node && game.node.identity === nodeName) {
                delete this.games[game.id];
            }
        });

        this.broadcastGameList();
    }
}

module.exports = Lobby;
