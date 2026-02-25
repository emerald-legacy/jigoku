export class Spectator {
    buttons = [];
    menuTitle = 'Spectator mode';
    name: string;
    emailHash: string;
    lobbyId?: string;
    left: boolean = false;
    disconnected: boolean = false;
    socket: any;

    constructor(
        public id: string,
        public user: { username: string; emailHash: string }
    ) {
        this.name = this.user.username;
        this.emailHash = this.user.emailHash;
    }

    getCardSelectionState() {
        return {};
    }

    getRingSelectionState() {
        return {};
    }

    getShortSummary() {
        return {
            name: this.name,
            id: this.id,
            type: 'spectator'
        };
    }
}
