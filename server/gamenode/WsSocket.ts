import * as env from '../env.js';
import { logger } from '../logger.js';
import {
    InboundMessageSchema,
    PROTOCOL_VERSION,
    type GameSummary,
    type OutboundMessage,
    type PendingGameDTO,
    type UserIdentity
} from './LobbyProtocol.js';

/** What the lobby asks of the game node, one method per inbound command. */
export interface LobbyHandlers {
    onStartGame(pendingGame: PendingGameDTO): void;
    onSpectator(pendingGame: { id: string }, user: UserIdentity): void;
    /** Asks for the running games; `reply` sends them to the lobby with HELLO. */
    onGameSync(reply: (games: GameSummary[]) => void): void;
    onFailedConnect(gameId: string, username: string): void;
    onCloseGame(gameId: string): void;
    onCardData(cardData: { titleCardData: unknown; shortCardData: unknown[] }): void;
}

/** A command's payload, or nothing for a command without one. */
type OutboundArg<Command extends OutboundMessage['command']> = Extract<OutboundMessage, { command: Command }> extends { arg: infer Result } ? [arg: Result] : [];

const TEN_SECONDS = 10_000;
const ONE_SECOND = 1_000;
const MAX_RECONNECT_DELAY = 5_000;
const OUTBOX_LIMIT = 200;
const OUTBOX_MAX_LENGTH = 16 * 1024 * 1024;

/** Game results the lobby must not miss: kept while the link is down and sent after the next HELLO. */
const OUTBOX_COMMANDS: ReadonlySet<OutboundMessage['command']> = new Set(['GAMEWIN', 'PLAYERLEFT', 'GAMEERROR']);

// Error payloads carry game debug data, which can contain references back to the
// Game object. Replace cycles instead of throwing so the report still gets sent.
export function stringifyWithoutCycles(value: unknown): string {
    const ancestors: unknown[] = [];

    return JSON.stringify(value, function(this: unknown, _key: string, val: unknown) {
        if(typeof val !== 'object' || val === null) {
            return val;
        }

        while(ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
            ancestors.pop();
        }

        if(ancestors.includes(val)) {
            return '[Circular]';
        }

        ancestors.push(val);
        return val;
    });
}

/** An error and its causes on one line, with their codes (e.g. ECONNREFUSED). */
function describeError(error: unknown): string {
    const parts: string[] = [];
    let current: unknown = error;
    while(current instanceof Error && parts.length < 5) {
        const code = 'code' in current && current.code !== undefined ? ` [${String(current.code)}]` : '';
        parts.push(`${current.name}: ${current.message || '(no message)'}${code}`);
        current = current.cause;
    }
    if(current !== undefined && current !== null && !(current instanceof Error)) {
        parts.push(String(current));
    }
    return parts.join(' <- ');
}

export class WsSocket {
    private ws: WebSocket | null = null;
    private registered = false;
    private reconnectDelay = ONE_SECOND;
    private outbox: { command: OutboundMessage['command']; message: string }[] = [];

    constructor(private listenAddress: string, private protocol: string, private handlers: LobbyHandlers) {
        process.nextTick(() => this.connect());

        setInterval(() => {
            if(this.registered) {
                logger.debug(`${env.gameNodeName} sending HEARTBEAT`);
                this.send('HEARTBEAT');
            } else {
                logger.info(`${env.gameNodeName} not registered, re-sending HELLO`);
                this.handlers.onGameSync((games) => this.onGameSync(games));
            }
        }, TEN_SECONDS);
    }

    private connect() {
        const secretParam = env.nodeSecret ? `&secret=${encodeURIComponent(env.nodeSecret)}` : '';
        const url = `${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}${secretParam}`;
        logger.info(`${env.gameNodeName} connecting to lobby at ${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}`);

        this.ws = new WebSocket(url);

        this.ws.addEventListener('open', () => {
            logger.info(`${env.gameNodeName} connected to lobby`);
            this.reconnectDelay = ONE_SECOND;
            this.handlers.onGameSync((games) => this.onGameSync(games));
        });

        this.ws.addEventListener('message', (event) => {
            this.onMessage(typeof event.data === 'string' ? event.data : String(event.data));
        });

        this.ws.addEventListener('close', (event) => {
            logger.info(`${env.gameNodeName} disconnected from lobby (code ${event.code}${event.reason ? `, reason "${event.reason}"` : ''}, ${event.wasClean ? 'clean' : 'not clean'})`);
            this.registered = false;
            this.scheduleReconnect();
        });

        this.ws.addEventListener('error', (event) => {
            const cause = describeError(event.error);
            logger.error(`WebSocket error: ${event.message || 'connection failed'}${cause ? ` (${cause})` : ''}`);
        });
    }

    private scheduleReconnect() {
        logger.info(`${env.gameNodeName} reconnecting in ${this.reconnectDelay}ms`);
        setTimeout(() => this.connect(), this.reconnectDelay);

        this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }

    public send<Command extends OutboundMessage['command']>(command: Command, ...[arg]: OutboundArg<Command>): void {
        const open = this.ws?.readyState === WebSocket.OPEN;
        if(!open && !OUTBOX_COMMANDS.has(command)) {
            logger.debug(`Cannot send ${command}, WebSocket not open`);
            return;
        }

        try {
            const message = stringifyWithoutCycles({ command, arg });
            if(this.ws && open) {
                this.ws.send(message);
            } else {
                this.queue(command, message);
            }
        } catch(err) {
            logger.error(`Error sending message: ${err}`);
        }
    }

    /** Bounded by count and total length; the oldest GAMEERROR (its debug data can be megabytes) goes first, then the oldest message. */
    private queue(command: OutboundMessage['command'], message: string) {
        this.outbox.push({ command, message });
        let length = this.outbox.reduce((sum, queued) => sum + queued.message.length, 0);
        while(this.outbox.length > OUTBOX_LIMIT || length > OUTBOX_MAX_LENGTH) {
            const errorIndex = this.outbox.findIndex((queued) => queued.command === 'GAMEERROR');
            const [dropped] = this.outbox.splice(Math.max(errorIndex, 0), 1);
            length -= dropped.message.length;
            logger.warn(`${env.gameNodeName} outbox full, dropped a queued ${dropped.command}`);
        }
        logger.info(`${env.gameNodeName} WebSocket not open, queued ${command} (${this.outbox.length} queued)`);
    }

    private flushOutbox() {
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN || this.outbox.length === 0) {
            return;
        }
        const messages = this.outbox;
        this.outbox = [];
        logger.info(`${env.gameNodeName} sending ${messages.length} queued messages`);
        for(const { message } of messages) {
            try {
                this.ws.send(message);
            } catch(err) {
                logger.error(`Error sending queued message: ${err}`);
            }
        }
    }

    private onGameSync(games: GameSummary[]) {
        const port = env.gameNodeProxyPort ?? env.gameNodeSocketIoPort;
        logger.info(`${env.gameNodeName} sending HELLO to lobby (address=${this.listenAddress}, port=${port}, games=${games.length})`);
        this.send('HELLO', {
            maxGames: env.maxGames,
            address: this.listenAddress,
            port: port,
            protocol: this.protocol,
            version: env.buildVersion,
            protocolVersion: PROTOCOL_VERSION,
            games: games
        });
        this.flushOutbox();
    }

    private parseMsg(msg: string) {
        try {
            return InboundMessageSchema.parse(JSON.parse(msg));
        } catch(e) {
            logger.info(`Failed to parse message: ${e}`);
            return undefined;
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

        try {
            switch(message.command) {
                case 'PING':
                    this.send('PONG');
                    break;
                case 'REGISTER':
                    logger.info('Lobby requested re-registration');
                    this.registered = false;
                    this.handlers.onGameSync((games) => this.onGameSync(games));
                    break;
                case 'STARTGAME':
                    this.handlers.onStartGame(message.arg);
                    break;
                case 'SPECTATOR':
                    this.handlers.onSpectator(message.arg.game, message.arg.user);
                    break;
                case 'CONNECTFAILED':
                    this.handlers.onFailedConnect(message.arg.gameId, message.arg.username);
                    break;
                case 'CLOSEGAME':
                    this.handlers.onCloseGame(message.arg.gameId);
                    break;
                case 'CARDDATA':
                    this.handlers.onCardData(message.arg);
                    break;
            }
        } catch(e) {
            logger.error(`${env.gameNodeName} failed to handle ${message.command}: ${e instanceof Error ? e.stack : e}`);
        }
    }
}
