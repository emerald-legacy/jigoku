import Socket from '../../server/Socket.js';
import jwt from 'jsonwebtoken';

const TEST_SECRET = 'testsecret';

function makeIoSocket() {
    const sock = jasmine.createSpyObj('ioSocket', ['on', 'emit', 'join', 'leave', 'disconnect']);
    sock.id = 'test-socket-id';
    sock.request = { user: null };
    return sock;
}

function fireRegisteredEvent(ioSocket: ReturnType<typeof makeIoSocket>, eventName: string, ...args: any[]) {
    const call = (ioSocket.on as jasmine.Spy).calls.allArgs().find((a: any[]) => a[0] === eventName);
    if(!call) { throw new Error(`No handler registered for '${eventName}'`); }
    call[1](...args);
}

describe('Socket', () => {
    let ioSocket: ReturnType<typeof makeIoSocket>;
    let socket: Socket;

    beforeEach(() => {
        ioSocket = makeIoSocket();
        socket = new Socket(ioSocket as any);
    });

    it('blocks game events for unauthenticated connections', () => {
        const handler = jasmine.createSpy('handler');
        socket.registerEvent('gameAction', handler);

        fireRegisteredEvent(ioSocket, 'gameAction', 'payload');

        expect(handler).not.toHaveBeenCalled();
    });

    it('dispatches game events after successful authentication', (done) => {
        const handler = jasmine.createSpy('handler');
        socket.registerEvent('gameAction', handler);

        socket.on('authenticate', () => {
            fireRegisteredEvent(ioSocket, 'gameAction', 'payload');
            expect(handler).toHaveBeenCalledWith(socket, 'payload');
            done();
        });

        (socket as any).onAuthenticate(jwt.sign({ username: 'alice' }, TEST_SECRET));
    });

    it('does not grant access on invalid credentials', (done) => {
        const handler = jasmine.createSpy('handler');
        socket.registerEvent('gameAction', handler);

        (socket as any).onAuthenticate('not.a.valid.token');

        setTimeout(() => {
            fireRegisteredEvent(ioSocket, 'gameAction', 'payload');
            expect(handler).not.toHaveBeenCalled();
            done();
        }, 20);
    });

    it('remains operational when an event handler throws', () => {
        const throwing = jasmine.createSpy('throwing').and.throwError('handler error');
        const working = jasmine.createSpy('working');
        socket.registerEvent('action1', throwing);
        socket.registerEvent('action2', working);
        (socket as any).user = { username: 'alice' };

        expect(() => fireRegisteredEvent(ioSocket, 'action1', 'x')).not.toThrow();

        fireRegisteredEvent(ioSocket, 'action2', 'x');
        expect(working).toHaveBeenCalledWith(socket, 'x');
    });
});
