import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';
import * as urlModule from 'url';
import { logger } from './logger';
import * as db from './db';
import GameService from './services/GameService';
import { lobbyWsUrl } from './env';

interface GameNode {
    identity: string;
    maxGames: number;
    numGames: number;
    address: string;
    port: number;
    protocol: string;
    disabled?: boolean;
    pingSent?: number;
    lastMessage?: number;
}

class GameRouter extends EventEmitter {
    workers: { [identity: string]: GameNode };
    private _gameService: InstanceType<typeof GameService> | null = null;
    connections: Map<string, WebSocket>;
    wss!: InstanceType<typeof WebSocketServer>;

    private get gameService(): InstanceType<typeof GameService> {
        if(!this._gameService) {
            this._gameService = new GameService(db.getDb());
        }
        return this._gameService;
    }

    constructor() {
        super();

        this.workers = {};
        this.connections = new Map();

        this.init(lobbyWsUrl);
        setInterval(this.checkTimeouts.bind(this), 1000 * 60);
    }

    init(listenUrl: string): void {
        const parsed = new URL(listenUrl);
        const port = parseInt(parsed.port, 10) || 6000;

        this.wss = new WebSocketServer({ port });
        logger.info(`GameRouter listening on ws://0.0.0.0:${port}`);

        this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
            const parsedUrl = urlModule.parse(req.url || '', true);
            const identity = parsedUrl.query.identity as string | undefined;

            if(!identity) {
                logger.error('WebSocket connection without identity, closing');
                ws.close();
                return;
            }

            logger.info(`Game node connected: ${identity}`);
            this.connections.set(identity, ws);

            ws.on('message', (data: any) => {
                this.onMessage(identity, data);
            });

            ws.on('close', () => {
                logger.info(`Game node disconnected: ${identity}`);
                this.connections.delete(identity);
            });

            ws.on('error', (err: Error) => {
                logger.error(`WebSocket error from ${identity}: ${err.message}`);
            });
        });
    }

    // External methods
    startGame(game: any): GameNode | undefined {
        const node = this.getNextAvailableGameNode();

        if(!node) {
            logger.error('Could not find new node for game');
            return;
        }

        this.gameService.create(game.getSaveState()).catch((err: Error) => {
            logger.error(`Failed to save game state: ${err.message}`);
        });

        node.numGames++;

        this.sendCommand(node.identity, 'STARTGAME', game);
        return node;
    }

    addSpectator(game: any, user: any): void {
        this.sendCommand(game.node.identity, 'SPECTATOR', { game: game, user: user });
    }

    getNextAvailableGameNode(): GameNode | undefined {
        const workerList = Object.values(this.workers);
        if(workerList.length === 0) {
            return undefined;
        }

        let returnedWorker: GameNode | undefined = undefined;

        workerList.forEach(worker => {
            if(worker.numGames >= worker.maxGames || worker.disabled) {
                return;
            }

            if(!returnedWorker || returnedWorker.numGames > worker.numGames) {
                returnedWorker = worker;
            }
        });

        return returnedWorker;
    }

    getNodeStatus(): Array<{ name: string; numGames: number; status: string }> {
        return Object.values(this.workers).map(worker => {
            return {
                name: worker.identity,
                numGames: worker.numGames,
                status: worker.disabled ? 'disabled' : 'active'
            };
        });
    }

    disableNode(nodeName: string): boolean {
        const worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = true;

        return true;
    }

    enableNode(nodeName: string): boolean {
        const worker = this.workers[nodeName];
        if(!worker) {
            return false;
        }

        worker.disabled = false;

        return true;
    }

    notifyFailedConnect(game: any, username: string): void {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CONNECTFAILED', { gameId: game.id, username: username });
    }

    closeGame(game: any): void {
        if(!game.node) {
            return;
        }

        this.sendCommand(game.node.identity, 'CLOSEGAME', { gameId: game.id });
    }

    // Events
    onMessage(identity: string, data: any): void {
        let worker = this.workers[identity];

        let message: any;

        try {
            message = JSON.parse(data.toString());
        } catch(err) {
            logger.info(err);
            return;
        }

        switch(message.command) {
            case 'HELLO':
                worker = {
                    identity: identity,
                    maxGames: message.arg.maxGames,
                    numGames: Object.keys(message.arg.games).length,
                    address: message.arg.address,
                    port: message.arg.port,
                    protocol: message.arg.protocol
                };
                this.workers[identity] = worker;

                this.emit('onWorkerStarted', identity);
                this.emit('onNodeReconnected', identity, message.arg.games);

                break;
            case 'PONG':
                if(worker) {
                    worker.pingSent = undefined;
                } else {
                    logger.error('PONG received for unknown worker');
                }
                break;
            case 'GAMEWIN':
                this.gameService.update(message.arg.game).catch((err: Error) => {
                    logger.error(`Failed to update game win state: ${err.message}`);
                });
                break;
            case 'GAMECLOSED':
                if(worker) {
                    worker.numGames--;
                } else {
                    logger.error('Got close game for non existent worker', identity);
                }

                this.emit('onGameClosed', message.arg.game);

                break;
            case 'PLAYERLEFT':
                if(!message.arg.spectator) {
                    this.gameService.update(message.arg.game).catch((err: Error) => {
                        logger.error(`Failed to update game on player left: ${err.message}`);
                    });
                }

                this.emit('onPlayerLeft', message.arg.gameId, message.arg.player);

                break;
        }

        if(worker) {
            worker.lastMessage = Date.now();
        }
    }

    // Internal methods
    sendCommand(identity: string, command: string, arg?: any): void {
        const ws = this.connections.get(identity);
        if(!ws || ws.readyState !== WebSocket.OPEN) {
            logger.error(`Cannot send ${command} to ${identity}: not connected`);
            return;
        }

        try {
            ws.send(JSON.stringify({ command: command, arg: arg }));
        } catch(err) {
            logger.error(`Error sending command: ${err}`);
        }
    }

    checkTimeouts(): void {
        const currentTime = Date.now();
        const pingTimeout = 1 * 60 * 1000;

        Object.values(this.workers).forEach(worker => {
            if(worker.pingSent && currentTime - worker.pingSent > pingTimeout) {
                logger.info('worker', worker.identity + ' timed out');
                delete this.workers[worker.identity];
                this.emit('onWorkerTimedOut', worker.identity);
            } else if(!worker.pingSent) {
                if(currentTime - (worker.lastMessage || 0) > pingTimeout) {
                    worker.pingSent = currentTime;
                    this.sendCommand(worker.identity, 'PING');
                }
            }
        });
    }

    close(): void {
        if(this.wss) {
            this.wss.close();
        }
    }
}

export = GameRouter;
