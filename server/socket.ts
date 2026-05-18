import { EventEmitter } from 'events';
import { Socket as IOSocket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { logger } from './logger';
import { captureException } from './ErrorMonitoring';
import { secret } from './env';

interface RequestWithUser {
    user: jwt.JwtPayload | null;
}

class Socket extends EventEmitter {
    socket: IOSocket;
    user: jwt.JwtPayload | null;

    constructor(socket: IOSocket) {
        super();

        this.socket = socket;
        this.user = (socket.request as unknown as RequestWithUser).user;

        socket.on('error', this.onError.bind(this));
        socket.on('authenticate', this.onAuthenticate.bind(this));
        socket.on('disconnect', this.onDisconnect.bind(this));
    }

    get id(): string {
        return this.socket.id;
    }

    // Commands
    registerEvent(event: string, callback: (socket: Socket, ...args: any[]) => void): void {
        this.socket.on(event, this.onSocketEvent.bind(this, callback));
    }

    joinChannel(channelName: string): void {
        this.socket.join(channelName);
    }

    leaveChannel(channelName: string): void {
        this.socket.leave(channelName);
    }

    send(message: string, ...args: any[]): void {
        this.socket.emit(message, ...args);
    }

    disconnect(): void {
        this.socket.disconnect();
    }

    // Events
    onSocketEvent(callback: (socket: Socket, ...args: any[]) => void, ...args: any[]): void {
        if(!this.user) {
            return;
        }

        try {
            callback(this, ...args);
        } catch(err) {
            logger.error(err);
            captureException(err, { args });
        }
    }

    onAuthenticate(token: string): void {
        jwt.verify(token, secret as string, { algorithms: ['HS256'] }, (err, user) => {
            if(err || typeof user !== 'object' || user === null) {
                logger.info(err);
                return;
            }

            const payload = user as jwt.JwtPayload;
            (this.socket.request as unknown as RequestWithUser).user = payload;
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

export = Socket;
