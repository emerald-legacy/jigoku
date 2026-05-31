import { WsSocket } from '../../server/gamenode/WsSocket.js';
import { PROTOCOL_VERSION } from '../../server/gamenode/LobbyProtocol.js';

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
    emit: jasmine.Spy;
    send?: (command: string, arg?: unknown) => void;
    onMessage?: (msg: string) => void;
    onGameSync?: (games: unknown[]) => void;
    parseMsg?: (msg: string) => unknown;
};

const proto = (WsSocket as unknown as { prototype: Record<string, (...args: unknown[]) => unknown> }).prototype;

function call<T = unknown>(method: string, ctx: unknown, ...args: unknown[]): T {
    return proto[method].apply(ctx, args) as T;
}

function makeWs(open = true): WsSpy {
    const ws = jasmine.createSpyObj<{ send: (data: string) => void }>('ws', ['send']) as WsSpy;
    ws.readyState = open ? 1 : 3;
    return ws;
}

function makeCtx(overrides: Partial<WsSocketCtx> = {}): WsSocketCtx {
    const ctx = Object.create(proto) as WsSocketCtx;
    Object.assign(ctx, {
        ws: null,
        running: true,
        registered: false,
        listenAddress: 'host',
        protocol: 'ws',
        heartbeatInterval: null,
        reconnectDelay: 1000,
        reconnectTimer: null,
        emit: jasmine.createSpy('emit'),
        ...overrides
    });
    return ctx;
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
        const result = call('parseMsg', ctx, JSON.stringify({ command: 'CLOSEGAME', arg: { gameId: 'g1' } })) as { command: string };
        expect(result).toBeDefined();
        expect(result.command).toBe('CLOSEGAME');
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

    it('REGISTER clears registered and emits onGameSync with the bound callback', () => {
        const { ctx } = withSendSpy({ registered: true });
        call('onMessage', ctx, JSON.stringify({ command: 'REGISTER' }));
        expect(ctx.registered).toBe(false);
        expect(ctx.emit).toHaveBeenCalledWith('onGameSync', jasmine.any(Function));
    });

    it('STARTGAME emits onStartGame with the pendingGame payload', () => {
        const { ctx } = withSendSpy();
        const pendingGame = { id: 'g1', players: {}, spectators: {} };
        call('onMessage', ctx, JSON.stringify({ command: 'STARTGAME', arg: pendingGame }));
        expect(ctx.emit).toHaveBeenCalledWith('onStartGame', jasmine.objectContaining({ id: 'g1' }));
    });

    it('SPECTATOR emits onSpectator with game and user', () => {
        const { ctx } = withSendSpy();
        const game = { id: 'g1', players: {}, spectators: {} };
        const user = { username: 'alice' };
        call('onMessage', ctx, JSON.stringify({ command: 'SPECTATOR', arg: { game, user } }));
        expect(ctx.emit).toHaveBeenCalledWith('onSpectator', jasmine.objectContaining({ id: 'g1' }), jasmine.objectContaining({ username: 'alice' }));
    });

    it('CONNECTFAILED emits onFailedConnect with gameId + username', () => {
        const { ctx } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'CONNECTFAILED', arg: { gameId: 'g1', username: 'alice' } }));
        expect(ctx.emit).toHaveBeenCalledWith('onFailedConnect', 'g1', 'alice');
    });

    it('CLOSEGAME emits onCloseGame with gameId', () => {
        const { ctx } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'CLOSEGAME', arg: { gameId: 'g1' } }));
        expect(ctx.emit).toHaveBeenCalledWith('onCloseGame', 'g1');
    });

    it('CARDDATA emits onCardData with arg', () => {
        const { ctx } = withSendSpy();
        const cardData = { someCard: { id: 'x' } };
        call('onMessage', ctx, JSON.stringify({ command: 'CARDDATA', arg: cardData }));
        expect(ctx.emit).toHaveBeenCalledWith('onCardData', jasmine.objectContaining(cardData));
    });

    it('drops malformed messages silently (no emit, no send, no throw)', () => {
        const { ctx, sendSpy } = withSendSpy();
        expect(() => call('onMessage', ctx, '{not-json')).not.toThrow();
        expect(sendSpy).not.toHaveBeenCalled();
        expect(ctx.emit).not.toHaveBeenCalled();
    });

    it('drops unknown commands silently', () => {
        const { ctx, sendSpy } = withSendSpy();
        call('onMessage', ctx, JSON.stringify({ command: 'WAT' }));
        expect(sendSpy).not.toHaveBeenCalled();
        expect(ctx.emit).not.toHaveBeenCalled();
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
