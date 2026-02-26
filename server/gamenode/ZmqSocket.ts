import EventEmitter from 'events';
import { Dealer } from 'zeromq';
import { z } from 'zod';
import * as env from '../env.js';
import { logger } from '../logger';

export class ZmqSocket extends EventEmitter {
    private socket: Dealer;
    private running = false;

    constructor(private listenAddress: string, private protocol: string) {
        super();

        this.socket = new Dealer({ routingId: env.gameNodeName });
        this.socket.connect(env.mqUrl);
        this.running = true;

        // Start receiving messages
        this.receiveMessages();

        // Connection is immediate in v6, emit connect event on next tick
        setImmediate(() => this.onConnect());
    }

    private async receiveMessages() {
        while(this.running) {
            try {
                // Dealer receives [delimiter, message] - the router adds identity automatically
                const [delimiter, msg] = await this.socket.receive();
                this.onMessage(delimiter, msg.toString());
            } catch(err) {
                if(this.running) {
                    logger.error('Error receiving message:', err);
                }
            }
        }
    }

    public send(command: string, arg?: unknown) {
        // Dealer sends [delimiter, message] - router will add routing based on identity
        this.socket.send(['', JSON.stringify({ command, arg })]).catch(err => {
            logger.error('Error sending message:', err);
        });
    }

    private onConnect() {
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    private onGameSync(games: any) {
        const port = env.gameNodeProxyPort ?? env.gameNodeSocketIoPort;
        this.send('HELLO', {
            maxGames: env.maxGames,
            address: this.listenAddress,
            port: port,
            protocol: this.protocol,
            version: env.buildVersion,
            games: games
        });
    }

    private parseMsg(msg: unknown) {
        try {
            return z
                .object({
                    command: z.enum(['PING', 'STARTGAME', 'SPECTATOR', 'CONNECTFAILED', 'CLOSEGAME', 'CARDDATA']),
                    arg: z.any()
                })
                .parse(JSON.parse(msg.toString()));
        } catch(e) {
            logger.info(e);
            return;
        }
    }

    private onMessage(delimiter: unknown, msg: string) {
        const message = this.parseMsg(msg);

        if(!message) {
            return;
        }

        switch(message.command) {
            case 'PING':
                this.send('PONG');
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
        this.socket.close();
    }
}
