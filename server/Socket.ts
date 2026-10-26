import { EventEmitter } from 'events';
import type { Socket as IOSocket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { logger } from './logger.js';
import { secret } from './env.js';

/** The part of a verified JWT payload the game node relies on. */
export const SocketUserSchema = z.looseObject({ username: z.string() });
type SocketUser = z.infer<typeof SocketUserSchema>;

/** Verifies a user's JWT: `done` gets why it failed, or the user it names. */
export function verifyUserToken(token: string, done: (error: string | undefined, user?: SocketUser) => void): void {
    jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, payload) => {
        if(err) {
            return done(`JWT verification failed: ${err.message}`);
        }
        const parsed = SocketUserSchema.safeParse(payload);
        if(!parsed.success) {
            return done('JWT payload has no username');
        }
        done(undefined, parsed.data);
    });
}

declare module 'http' {
    interface IncomingMessage {
        /** Set by the game server's handshake once the token has been verified. */
        user?: SocketUser | null;
    }
}

/** The parts of a socket.io socket this wrapper uses. */
export interface SocketLike extends Pick<IOSocket, 'id' | 'on' | 'join' | 'leave' | 'emit' | 'disconnect'> {
    request: { user?: SocketUser | null };
}

export class Socket extends EventEmitter {
    socket: SocketLike;
    user: SocketUser | null;

    constructor(socket: SocketLike) {
        super();

        this.socket = socket;
        this.user = socket.request.user ?? null;

        socket.on('error', this.onError.bind(this));
        socket.on('authenticate', this.onAuthenticate.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get id(): string {
        return this.socket.id;
    }

    // Commands
    registerEvent(event: string, callback: (socket: Socket, ...args: unknown[]) => void): void {
        this.socket.on(event, this.onSocketEvent.bind(this, callback));
    }

    joinChannel(channelName: string): void {
        this.socket.join(channelName);
    }

    leaveChannel(channelName: string): void {
        this.socket.leave(channelName);
    }

    send(message: string, ...args: unknown[]): void {
        this.socket.emit(message, ...args);
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    // Events
    onSocketEvent(callback: (socket: Socket, ...args: unknown[]) => void, ...args: unknown[]): void {
        if(!this.user) {
            return;
        }

        try {
            callback(this, ...args);
        } catch(err) {
            logger.error('Socket event handler error', { error: err, args });
        }
    }

    onAuthenticate(token: string): void {
        verifyUserToken(token, (error, payload) => {
            if(error || !payload) {
                logger.info(error);
                return;
            }

            if(this.user && this.user.username !== payload.username) {
                this.socket.disconnect();
                return;
            }
            this.socket.request.user = payload;
            this.user = payload;
            this.emit('authenticate', this, payload);
        });
    }

    onDisconnect(reason: string): void {
        this.emit('disconnect', this, reason);
    }

    onError(err: Error): void {
        logger.info('Socket.IO error', err, '. Socket ID ', this.socket.id);
    }
}

