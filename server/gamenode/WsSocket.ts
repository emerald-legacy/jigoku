import EventEmitter from 'events';
import WebSocket from 'ws';
import { z } from 'zod';
import * as env from '../env.js';
import { logger } from '../logger';

const TEN_SECONDS = 10_000;
const ONE_SECOND = 1_000;
const MAX_RECONNECT_DELAY = 5_000;

export class WsSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private running = false;
    private registered = false;
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private reconnectDelay = ONE_SECOND;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private listenAddress: string, private protocol: string) {
        super();

        this.running = true;
        process.nextTick(() => this.connect());

        this.heartbeatInterval = setInterval(() => {
            if(this.registered) {
                logger.debug(`${env.gameNodeName} sending HEARTBEAT`);
                this.send('HEARTBEAT');
            } else {
                logger.info(`${env.gameNodeName} not registered, re-sending HELLO`);
                this.emit('onGameSync', this.onGameSync.bind(this));
            }
        }, TEN_SECONDS);
    }

    private connect() {
        const secretParam = env.nodeSecret ? `&secret=${encodeURIComponent(env.nodeSecret)}` : "";
        const url = `${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}${secretParam}`;
        logger.info(`${env.gameNodeName} connecting to lobby at ${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}`);

        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            logger.info(`${env.gameNodeName} connected to lobby`);
            this.reconnectDelay = ONE_SECOND;
            this.emit('onGameSync', this.onGameSync.bind(this));
        });

        this.ws.on('message', (data: WebSocket.RawData) => {
            this.onMessage(data.toString());
        });

        this.ws.on('close', () => {
            logger.info(`${env.gameNodeName} disconnected from lobby`);
            this.registered = false;
            this.scheduleReconnect();
        });

        this.ws.on('error', (err: Error) => {
            logger.error(`WebSocket error: ${err.message}`);
        });
    }

    private scheduleReconnect() {
        if(!this.running) {
            return;
        }

        logger.info(`${env.gameNodeName} reconnecting in ${this.reconnectDelay}ms`);
        this.reconnectTimer = setTimeout(() => {
            if(this.running) {
                this.connect();
            }
        }, this.reconnectDelay);

        this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }

    public send(command: string, arg?: unknown) {
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            logger.debug(`Cannot send ${command}, WebSocket not open`);
            return;
        }

        try {
            this.ws.send(JSON.stringify({ command, arg }));
        } catch(err) {
            logger.error(`Error sending message: ${err}`);
        }
    }

    private onGameSync(games: any) {
        const port = env.gameNodeProxyPort ?? env.gameNodeSocketIoPort;
        logger.info(`${env.gameNodeName} sending HELLO to lobby (address=${this.listenAddress}, port=${port}, games=${Object.keys(games).length})`);
        this.send('HELLO', {
            maxGames: env.maxGames,
            address: this.listenAddress,
            port: port,
            protocol: this.protocol,
            version: env.buildVersion,
            games: games
        });
    }

    private parseMsg(msg: string) {
        try {
            return z
                .object({
                    command: z.enum(['PING', 'REGISTER', 'STARTGAME', 'SPECTATOR', 'CONNECTFAILED', 'CLOSEGAME', 'CARDDATA']),
                    arg: z.any()
                })
                .parse(JSON.parse(msg));
        } catch(e) {
            logger.info(`Failed to parse message: ${e}`);
            return;
        }
    }

    private onMessage(msg: string) {
        const message = this.parseMsg(msg);

        if(!message) {
            return;
        }

        if(message.command === 'PING') {
            logger.debug(`${env.gameNodeName} received PING from lobby`);
        } else {
            logger.info(`${env.gameNodeName} received ${message.command} from lobby`);
        }

        this.registered = true;

        switch(message.command) {
            case 'PING':
                this.send('PONG');
                break;
            case 'REGISTER':
                logger.info('Lobby requested re-registration');
                this.registered = false;
                this.emit('onGameSync', this.onGameSync.bind(this));
                break;
            case 'STARTGAME':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR':
                this.emit('onSpectator', message.arg.game, message.arg.user);
                break;
            case 'CONNECTFAILED':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
            case 'CLOSEGAME':
                this.emit('onCloseGame', message.arg.gameId);
                break;
            case 'CARDDATA':
                this.emit('onCardData', message.arg);
                break;
        }
    }

    public close() {
        this.running = false;
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if(this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        if(this.ws) {
            this.ws.close();
        }
    }
}
