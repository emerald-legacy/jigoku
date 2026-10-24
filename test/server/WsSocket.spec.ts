import { WsSocket, type LobbyHandlers } from '../../server/gamenode/WsSocket.js';
import { PROTOCOL_VERSION } from '../../server/gamenode/LobbyProtocol.js';
import { callMethod } from '../helpers/methodaccess.js';

type WsSpy = jasmine.SpyObj<{ send: (data: string) => void }> & { readyState: number };

type WsSocketCtx = {
    ws: WsSpy | null;
    running: boolean;
    registered: boolean;
    listenAddress: string;
    protocol: string;
    heartbeatInterval: ReturnType<typeof setInterval> | null;
    reconnectDelay: number;
    reconnectTimer: ReturnType<typeof setTimeout> | null;
    handlers: jasmine.SpyObj<LobbyHandlers>;
    send?: (command: string, arg?: unknown) => void;
    onMessage?: (msg: string) => void;
    onGameSync?: (games: unknown[]) => void;
    parseMsg?: (msg: string) => unknown;
};

function call(method: string, ctx: WsSocketCtx, ...args: unknown[]): unknown {
    return callMethod(ctx, method, ...args);
}

function makeWs(open = true): WsSpy {
    return Object.assign(jasmine.createSpyObj<{ send: (data: string) => void }>('ws', ['send']), { readyState: open ? 1 : 3 });
}

function makeCtx(overrides: Partial<WsSocketCtx> = {}): WsSocketCtx {
    // built on the prototype: the real constructor connects to the lobby and starts a heartbeat
    const ctx: WsSocketCtx = Object.create(WsSocket.prototype);
    Object.assign(ctx, {
        ws: null,
        running: true,
        registered: false,
        listenAddress: 'host',
        protocol: 'ws',
        heartbeatInterval: null,
        reconnectDelay: 1000,
        reconnectTimer: null,
        handlers: jasmine.createSpyObj<LobbyHandlers>('handlers', ['onStartGame', 'onSpectator', 'onGameSync', 'onFailedConnect', 'onCloseGame', 'onCardData']),
        ...overrides
    });
    return ctx;
}

function expectNoHandlerCalled(ctx: WsSocketCtx): void {
    for(const handler of Object.values(ctx.handlers)) {
        expect(handler).not.toHaveBeenCalled();
    }
}

describe('WsSocket.send', () => {
    it('serialises and sends when ws is OPEN', () => {
        const ws = makeWs(true);
        const ctx = makeCtx({ ws });
        call('send', ctx, 'HEARTBEAT');
        expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ command: 'HEARTBEAT', arg: undefined }));
    });

    it('skips send when ws is null', () => {
        const ctx = makeCtx({ ws: null });
        call('send', ctx, 'HEARTBEAT');
    });

    it('skips send when ws.readyState is not OPEN', () => {
        const ws = makeWs(false);
        const ctx = makeCtx({ ws });
        call('send', ctx, 'HEARTBEAT');
        expect(ws.send).not.toHaveBeenCalled();
    });

    it('catches errors from ws.send and continues', () => {
        const ws = makeWs(true);
        ws.send.and.throwError(new Error('socket broken'));
        const ctx = makeCtx({ ws });
        expect(() => call('send', ctx, 'PONG')).not.toThrow();
    });

    it('passes the arg through to JSON.stringify', () => {
        const ws = makeWs(true);
        const ctx = makeCtx({ ws });
        const arg = { gameId: 'g1' };
        call('send', ctx, 'GAMECLOSED', arg);
        expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ command: 'GAMECLOSED', arg }));
    });
});

describe('WsSocket.parseMsg', () => {
    it('returns the parsed message for valid envelopes', () => {
        const ctx = makeCtx();
        const result = call('parseMsg', ctx, JSON.stringify({ command: 'CLOSEGAME', arg: { gameId: 'g1' } }));
        expect(result).toEqual(jasmine.objectContaining({ command: 'CLOSEGAME' }));
    });

    it('returns undefined for malformed JSON', () => {
        const ctx = makeCtx();
        expect(call('parseMsg', ctx, '{not-json')).toBeUndefined();
    });

    it('returns undefined for unknown commands', () => {
        const ctx = makeCtx();
        expect(call('parseMsg', ctx, JSON.stringify({ command: 'WAT', arg: {} }))).toBeUndefined();
    });

    it('returns undefined when CLOSEGAME is missing required arg.gameId', () => {
        const ctx = makeCtx();
        expect(call('parseMsg', ctx, JSON.stringify({ command: 'CLOSEGAME', arg: {} }))).toBeUndefined();
    });
});

describe('WsSocket.onMessage', () => {
    function withSendSpy(extra: Partial<WsSocketCtx> = {}) {
        const sendSpy = jasmine.createSpy('send');
        const ctx = makeCtx({ ...extra, send: sendSpy });
        return { ctx, sendSpy };
    }

    it('PING triggers a PONG response and marks the socket registered', () => {
        const { ctx, sendSpy } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'PING' }));
        expect(sendSpy).toHaveBeenCalledWith('PONG');
        expect(ctx.registered).toBe(true);
    });

    it('REGISTER clears registered and asks the server for its games', () => {
        const { ctx } = withSendSpy({ registered: true });
        call('onMessage', ctx, JSON.stringify({ command: 'REGISTER' }));
        expect(ctx.registered).toBe(false);
        expect(ctx.handlers.onGameSync).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('STARTGAME calls onStartGame with the pendingGame payload', () => {
        const { ctx } = withSendSpy();
        const pendingGame = {
            id: 'g1',
            name: 'Game',
            owner: 'alice',
            allowSpectators: true,
            players: { alice: { id: 'p1', name: 'alice', user: { username: 'alice' } } },
            spectators: {}
        };
        call('onMessage', ctx, JSON.stringify({ command: 'STARTGAME', arg: pendingGame }));
        expect(ctx.handlers.onStartGame).toHaveBeenCalledWith(jasmine.objectContaining({ id: 'g1' }));
    });

    it('drops STARTGAME when a player has no user', () => {
        const { ctx } = withSendSpy();
        const pendingGame = { id: 'g1', name: 'Game', owner: 'alice', allowSpectators: true, players: { alice: { id: 'p1', name: 'alice' } }, spectators: {} };
        call('onMessage', ctx, JSON.stringify({ command: 'STARTGAME', arg: pendingGame }));
        expectNoHandlerCalled(ctx);
    });

    it('SPECTATOR calls onSpectator with game and user', () => {
        const { ctx } = withSendSpy();
        const game = { id: 'g1', players: {}, spectators: {} };
        const user = { username: 'alice' };
        call('onMessage', ctx, JSON.stringify({ command: 'SPECTATOR', arg: { game, user } }));
        expect(ctx.handlers.onSpectator).toHaveBeenCalledWith(jasmine.objectContaining({ id: 'g1' }), jasmine.objectContaining({ username: 'alice' }));
    });

    it('CONNECTFAILED calls onFailedConnect with gameId + username', () => {
        const { ctx } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'CONNECTFAILED', arg: { gameId: 'g1', username: 'alice' } }));
        expect(ctx.handlers.onFailedConnect).toHaveBeenCalledWith('g1', 'alice');
    });

    it('CLOSEGAME calls onCloseGame with gameId', () => {
        const { ctx } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'CLOSEGAME', arg: { gameId: 'g1' } }));
        expect(ctx.handlers.onCloseGame).toHaveBeenCalledWith('g1');
    });

    it('CARDDATA calls onCardData with arg', () => {
        const { ctx } = withSendSpy();
        const cardData = { titleCardData: {}, shortCardData: [{ id: 'x', name: 'X' }] };
        call('onMessage', ctx, JSON.stringify({ command: 'CARDDATA', arg: cardData }));
        expect(ctx.handlers.onCardData).toHaveBeenCalledWith(jasmine.objectContaining(cardData));
    });

    it('drops malformed messages silently (no handler, no send, no throw)', () => {
        const { ctx, sendSpy } = withSendSpy();
        expect(() => call('onMessage', ctx, '{not-json')).not.toThrow();
        expect(sendSpy).not.toHaveBeenCalled();
        expectNoHandlerCalled(ctx);
    });

    it('drops unknown commands silently', () => {
        const { ctx, sendSpy } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'WAT' }));
        expect(sendSpy).not.toHaveBeenCalled();
        expectNoHandlerCalled(ctx);
    });
});

describe('WsSocket.onGameSync', () => {
    it('sends HELLO with maxGames, addr, port, protocol, version, protocolVersion, and games', () => {
        const sendSpy = jasmine.createSpy('send');
        const ctx = makeCtx({ send: sendSpy, listenAddress: 'host', protocol: 'wss' });
        const games = [{ id: 'g1' }, { id: 'g2' }];
        call('onGameSync', ctx, games);
        const [command, arg] = sendSpy.calls.mostRecent().args;
        expect(command).toBe('HELLO');
        expect(arg).toEqual(jasmine.objectContaining({
            address: 'host',
            protocol: 'wss',
            protocolVersion: PROTOCOL_VERSION,
            games
        }));
    });
});
