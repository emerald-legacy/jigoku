import { SpectatorBase } from './SpectatorBase.js';
import type { Socket } from '../Socket.js';
import type { UserIdentity } from '../gamenode/LobbyProtocol.js';

export class Spectator extends SpectatorBase {
    name: string;
    emailHash: string;
    lobbyId?: string;
    left: boolean = false;
    disconnected: boolean = false;
    socket: Socket | null | undefined;

    constructor(
        public id: string,
        public user: UserIdentity
    ) {
        super();
        this.name = this.user.username;
        this.emailHash = this.user.emailHash ?? '';
    }

    getShortSummary() {
        return {
            name: this.name,
            id: this.id,
            type: 'spectator'
        };
    }
}
