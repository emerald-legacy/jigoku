// gamerouter.spec.ts — London-style TDD for GameRouter
// Stubs ws, db, and GameService via require.cache before loading GameRouter.

// ---- Env vars ----
process.env.DB_PATH = 'mongodb://localhost/test';
process.env.DOMAIN = 'localhost';
process.env.ENVIRONMENT = 'test';
process.env.GAME_NODE_NAME = 'test-node';
process.env.GAME_NODE_SOCKET_IO_PORT = '9500';
process.env.HTTPS = 'false';
process.env.LOBBY_PORT = '4000';
process.env.LOBBY_WS_URL = 'ws://lobby:6000';
process.env.SECRET = 'test-secret';

// ---- Stubs ----

const mockWss = {
    on: jasmine.createSpy('wss.on'),
    close: jasmine.createSpy('wss.close')
};
const MockWebSocketServer = jasmine.createSpy('WebSocketServer').and.returnValue(mockWss);

const mockGameService = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    update: jasmine.createSpy('update').and.returnValue(Promise.resolve())
};
const MockGameService = jasmine.createSpy('GameService').and.returnValue(mockGameService);

function makeCacheEntry(resolvedPath: string, exports: any) {
    return { id: resolvedPath, filename: resolvedPath, loaded: true, exports, parent: null, children: [], paths: [] };
}

// Inject stubs before gamerouter is required
const wsPath = require.resolve('ws');
const dbPath = require.resolve('../../server/db');
const gsPath = require.resolve('../../server/services/GameService');
const grPath = require.resolve('../../server/gamerouter');

const origWs = (require.cache as any)[wsPath];
const origDb = (require.cache as any)[dbPath];
const origGs = (require.cache as any)[gsPath];

(require.cache as any)[wsPath] = makeCacheEntry(wsPath, { WebSocketServer: MockWebSocketServer, WebSocket: { OPEN: 1 } });
(require.cache as any)[dbPath] = makeCacheEntry(dbPath, { getDb: () => ({}), connect: async () => {}, close: async () => {}, toObjectId: (x: any) => x });
(require.cache as any)[gsPath] = makeCacheEntry(gsPath, MockGameService);
// Force fresh load of gamerouter so it captures our stubs (not a previously cached version)
delete (require.cache as any)[grPath];

const GameRouter = require('../../server/gamerouter') as any;

// Restore cache
const restore = (path: string, orig: any) => orig ? ((require.cache as any)[path] = orig) : delete (require.cache as any)[path];
restore(wsPath, origWs);
restore(dbPath, origDb);
restore(gsPath, origGs);

// ---- Helpers ----

function makeRouter(): any {
    MockWebSocketServer.calls.reset();
    mockWss.on.calls.reset();
    mockGameService.create.calls.reset();
    mockGameService.update.calls.reset();
    return new GameRouter();
}

function addWorker(router: any, identity: string, numGames: number = 0, maxGames: number = 5, disabled: boolean = false) {
    router.workers[identity] = {
        identity,
        maxGames,
        numGames,
        address: '127.0.0.1',
        port: 9500,
        protocol: 'http',
        disabled,
        lastMessage: Date.now()
    };
    return router.workers[identity];
}

// ---- Tests ----

describe('GameRouter', () => {
    let router: any;

    beforeEach(() => {
        router = makeRouter();
    });

    afterEach(() => {
        if(router) { router.wss = null; }
    });

    describe('constructor', () => {
        it('creates a WebSocketServer', () => {
            expect(MockWebSocketServer).toHaveBeenCalled();
        });
    });

    describe('getNextAvailableGameNode()', () => {
        it('returns undefined when no workers', () => {
            expect(router.getNextAvailableGameNode()).toBeUndefined();
        });

        it('returns the only available worker', () => {
            addWorker(router, 'node-1', 0, 5);
            expect(router.getNextAvailableGameNode()).toBe(router.workers['node-1']);
        });

        it('returns worker with fewest games', () => {
            addWorker(router, 'node-1', 3, 5);
            addWorker(router, 'node-2', 1, 5);
            expect(router.getNextAvailableGameNode()).toBe(router.workers['node-2']);
        });

        it('skips disabled workers', () => {
            addWorker(router, 'node-1', 0, 5, true);
            expect(router.getNextAvailableGameNode()).toBeUndefined();
        });

        it('skips workers at maxGames', () => {
            addWorker(router, 'node-1', 5, 5, false);
            expect(router.getNextAvailableGameNode()).toBeUndefined();
        });

        it('returns available worker when one is full and one is not', () => {
            addWorker(router, 'node-1', 5, 5);
            addWorker(router, 'node-2', 2, 5);
            expect(router.getNextAvailableGameNode()).toBe(router.workers['node-2']);
        });
    });

    describe('getNodeStatus()', () => {
        it('returns empty array when no workers', () => {
            expect(router.getNodeStatus()).toEqual([]);
        });

        it('returns correct shape for active worker', () => {
            addWorker(router, 'node-1', 2, 5, false);
            const status = router.getNodeStatus();
            expect(status.length).toBe(1);
            expect(status[0].name).toBe('node-1');
            expect(status[0].numGames).toBe(2);
            expect(status[0].status).toBe('active');
        });

        it('returns disabled status for disabled worker', () => {
            addWorker(router, 'node-1', 0, 5, true);
            const status = router.getNodeStatus();
            expect(status[0].status).toBe('disabled');
        });
    });

    describe('disableNode()', () => {
        it('returns false for unknown node', () => {
            expect(router.disableNode('unknown')).toBe(false);
        });

        it('sets disabled=true and returns true', () => {
            addWorker(router, 'node-1');
            const result = router.disableNode('node-1');
            expect(result).toBe(true);
            expect(router.workers['node-1'].disabled).toBe(true);
        });
    });

    describe('enableNode()', () => {
        it('returns false for unknown node', () => {
            expect(router.enableNode('unknown')).toBe(false);
        });

        it('sets disabled=false and returns true', () => {
            addWorker(router, 'node-1', 0, 5, true);
            const result = router.enableNode('node-1');
            expect(result).toBe(true);
            expect(router.workers['node-1'].disabled).toBe(false);
        });
    });

    describe('onMessage() — HELLO', () => {
        it('registers worker in workers map', () => {
            const data = JSON.stringify({
                command: 'HELLO',
                arg: { maxGames: 3, address: '127.0.0.1', port: 9500, protocol: 'http', games: {} }
            });
            router.onMessage('node-1', data);
            expect(router.workers['node-1']).toBeDefined();
            expect(router.workers['node-1'].maxGames).toBe(3);
            expect(router.workers['node-1'].numGames).toBe(0);
        });

        it('emits onWorkerStarted', () => {
            let emittedIdentity: string | undefined;
            router.on('onWorkerStarted', (id: string) => { emittedIdentity = id; });
            const data = JSON.stringify({
                command: 'HELLO',
                arg: { maxGames: 2, address: '127.0.0.1', port: 9500, protocol: 'http', games: {} }
            });
            router.onMessage('node-1', data);
            expect(emittedIdentity).toBe('node-1');
        });

        it('sets numGames from existing games count on reconnect', () => {
            const data = JSON.stringify({
                command: 'HELLO',
                arg: {
                    maxGames: 5,
                    address: '127.0.0.1',
                    port: 9500,
                    protocol: 'http',
                    games: { 'game-a': {}, 'game-b': {} }
                }
            });
            router.onMessage('node-1', data);
            expect(router.workers['node-1'].numGames).toBe(2);
        });
    });

    describe('onMessage() — GAMECLOSED', () => {
        it('decrements numGames and emits onGameClosed', () => {
            addWorker(router, 'node-1', 3, 5);
            let closedGame: any;
            router.on('onGameClosed', (game: any) => { closedGame = game; });
            const data = JSON.stringify({ command: 'GAMECLOSED', arg: { game: { gameId: 'g1' } } });
            router.onMessage('node-1', data);
            expect(router.workers['node-1'].numGames).toBe(2);
            expect(closedGame).toEqual({ gameId: 'g1' });
        });
    });

    describe('onMessage() — PLAYERLEFT', () => {
        it('emits onPlayerLeft with gameId and player', () => {
            addWorker(router, 'node-1', 1, 5);
            let leftGameId: string | undefined;
            let leftPlayer: string | undefined;
            router.on('onPlayerLeft', (gameId: string, player: string) => {
                leftGameId = gameId;
                leftPlayer = player;
            });
            const data = JSON.stringify({
                command: 'PLAYERLEFT',
                arg: { gameId: 'g1', player: 'alice', game: { gameId: 'g1' }, spectator: false }
            });
            router.onMessage('node-1', data);
            expect(leftGameId).toBe('g1');
            expect(leftPlayer).toBe('alice');
        });
    });

    describe('sendCommand()', () => {
        it('sends JSON to websocket connection', () => {
            const mockWsConn = { readyState: 1, send: jasmine.createSpy('send') };
            router.connections.set('node-1', mockWsConn);
            router.sendCommand('node-1', 'STARTGAME', { id: 'g1' });
            expect(mockWsConn.send).toHaveBeenCalledWith(
                JSON.stringify({ command: 'STARTGAME', arg: { id: 'g1' } })
            );
        });

        it('does nothing when connection not present', () => {
            expect(() => router.sendCommand('unknown', 'PING')).not.toThrow();
        });

        it('does nothing when readyState is not 1', () => {
            const mockWsConn = { readyState: 3, send: jasmine.createSpy('send') };
            router.connections.set('node-1', mockWsConn);
            router.sendCommand('node-1', 'PING');
            expect(mockWsConn.send).not.toHaveBeenCalled();
        });
    });
});
