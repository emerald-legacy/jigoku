import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { logger } from './logger.js';
import { GameChat } from './game/GameChat.js';

interface PendingGameDetails {
    name: string;
    spectators: boolean;
    spectatorSquelch: boolean;
    gameType: string;
    clocks: any;
}

interface PendingPlayer {
    id: string;
    name: string;
    user: any;
    emailHash: string;
    owner: boolean;
    left?: boolean;
    disconnected?: boolean;
    deck?: any;
    faction?: any;
    agenda?: any;
}

interface PendingSpectator {
    id: string;
    name: string;
    user: any;
    emailHash: string;
    settings?: any;
}

interface PendingGameSaveState {
    gameId: string;
    gameType: string;
    players: Array<{ faction: string; name: string }>;
    startedAt: Date;
}

class PendingGame {
    owner: any;
    players: { [username: string]: PendingPlayer };
    spectators: { [username: string]: PendingSpectator };
    id: string;
    name: string;
    allowSpectators: boolean;
    spectatorSquelch: boolean;
    gameType: string;
    clocks: any;
    createdAt: Date;
    gameChat: GameChat;
    node: any;
    started: boolean;
    password?: string;

    constructor(owner: any, details: PendingGameDetails) {
        this.owner = owner;
        this.players = {};
        this.spectators = {};
        this.id = uuid.v1();
        this.name = details.name;
        this.allowSpectators = details.spectators;
        this.spectatorSquelch = details.spectatorSquelch;
        this.gameType = details.gameType;
        this.clocks = details.clocks;
        this.createdAt = new Date();
        this.gameChat = new GameChat();
        this.node = null;
        this.started = false;
    }

    // Getters
    getPlayersAndSpectators(): { [name: string]: PendingPlayer | PendingSpectator } {
        return Object.assign({}, this.players, this.spectators);
    }

    getPlayers(): { [username: string]: PendingPlayer } {
        return this.players;
    }

    getPlayerOrSpectator(playerName: string): PendingPlayer | PendingSpectator | undefined {
        return this.getPlayersAndSpectators()[playerName];
    }

    getPlayerByName(playerName: string): PendingPlayer | undefined {
        return this.players[playerName];
    }

    getSaveState(): PendingGameSaveState {
        const players = Object.values(this.getPlayers()).map((player) => {
            return {
                faction: player.faction?.name ?? '',
                name: player.name
            };
        });

        return {
            gameId: this.id,
            gameType: this.gameType,
            players: players,
            startedAt: this.createdAt
        };
    }

    // Helpers
    setupFaction(player: PendingPlayer, faction: any): void {
        player.faction = {};
        player.faction = faction;
    }

    // Actions
    addMessage(message: string, ...args: any[]): void {
        this.gameChat.addMessage(message, ...args);
    }

    addPlayer(id: string, user: any): void {
        this.players[user.username] = {
            id: id,
            name: user.username,
            user: user,
            emailHash: user.emailHash,
            owner: this.owner.username === user.username
        };
    }

    addSpectator(id: string, user: any): void {
        this.spectators[user.username] = {
            id: id,
            name: user.username,
            user: user,
            emailHash: user.emailHash
        };
    }

    newGame(id: string, user: any, password: string | undefined, callback: (err?: Error) => void): void {
        if(password) {
            bcrypt.hash(password, 10, (err: Error | undefined, hash: string) => {
                if(err) {
                    logger.info(err.message);
                    callback(err);
                    return;
                }

                this.password = hash;
                this.addPlayer(id, user);

                callback();
            });
        } else {
            this.addPlayer(id, user);
            callback();
        }
    }

    isUserBlocked(user: any): boolean {
        return (this.owner.blockList || []).includes(user.username.toLowerCase());
    }

    join(id: string, user: any, password: string | undefined, callback: (err?: Error, msg?: string) => void): void {
        if(Object.keys(this.players).length === 2 || this.started) {
            callback(new Error('Game is full or has already started'));
            return;
        }

        if(this.isUserBlocked(user)) {
            callback(new Error('You have been blocked by the owner of this game'));
            return;
        }

        if(this.password) {
            if(!password) {
                return callback(new Error('Bad password'), 'Incorrect game password');
            }
            bcrypt.compare(password, this.password, (err: Error | undefined, valid: boolean) => {
                if(err) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                if(!valid) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                this.addPlayer(id, user);
                callback();
            });
        } else {
            this.addPlayer(id, user);
            callback();
        }
    }

    watch(id: string, user: any, password: string | undefined, callback: (err?: Error, msg?: string) => void): void {
        if(!this.allowSpectators) {
            callback(new Error('Join not permitted'));
            return;
        }

        if(this.isUserBlocked(user)) {
            callback(new Error('You have been blocked by the owner of this game'));
            return;
        }

        if(this.password) {
            if(!password) {
                return callback(new Error('Bad password'), 'Incorrect game password');
            }
            bcrypt.compare(password, this.password, (err: Error | undefined, valid: boolean) => {
                if(err) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                if(!valid) {
                    return callback(new Error('Bad password'), 'Incorrect game password');
                }

                this.addSpectator(id, user);
                this.addMessage('{0} has joined the game as a spectator', user.username);
                callback();
            });
        } else {
            this.addSpectator(id, user);
            this.addMessage('{0} has joined the game as a spectator', user.username);
            callback();
        }
    }

    leave(playerName: string): void {
        const player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        if(!this.started) {
            this.addMessage('{0} has left the game', playerName);
        }

        if(this.players[playerName]) {
            if(this.started) {
                this.players[playerName].left = true;
            } else {
                delete this.players[playerName];
            }
        }

        if(this.spectators[playerName]) {
            delete this.spectators[playerName];
        }
    }

    disconnect(playerName: string): void {
        const player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        if(!this.started) {
            this.addMessage('{0} has disconnected', playerName);
        }

        if(this.players[playerName]) {
            if(!this.started) {
                delete this.players[playerName];
            }
        } else {
            delete this.spectators[playerName];
        }
    }

    chat(playerName: string, message: string): void {
        const player = this.getPlayerOrSpectator(playerName);
        if(!player) {
            return;
        }

        this.addMessage('{0} {1}', player, message);
    }

    selectDeck(playerName: string, deck: any): void {
        const player = this.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        if(player.deck) {
            player.deck.selected = false;
        }

        player.deck = deck;
        player.deck.selected = true;

        this.setupFaction(player, deck.faction);
    }

    // Interrogators
    isEmpty(): boolean {
        return !Object.values(this.getPlayersAndSpectators()).some((player) => this.hasActivePlayer((player as any).name));
    }

    isOwner(playerName: string): boolean {
        const player = this.players[playerName];

        if(!player || !player.owner) {
            return false;
        }

        return true;
    }

    hasActivePlayer(playerName: string): boolean {
        return !!(
            (this.players[playerName] && !this.players[playerName].left && !this.players[playerName].disconnected) ||
            this.spectators[playerName]
        );
    }

    // Summary
    getSummary(activePlayer: string | undefined): any {
        const playerSummaries: { [name: string]: any } = {};
        const playersInGame = Object.values(this.players).filter((player) => !player.left);

        playersInGame.forEach((player) => {
            let deck: any;

            if(activePlayer === player.name && player.deck) {
                deck = { name: player.deck.name, selected: player.deck.selected, status: player.deck.status };
            } else if(player.deck) {
                deck = { selected: player.deck.selected, status: player.deck.status };
            } else {
                deck = {};
            }

            playerSummaries[player.name] = {
                agenda: this.started && player.agenda ? player.agenda.cardData.code : undefined,
                deck: activePlayer ? deck : {},
                emailHash: player.emailHash,
                faction: this.started && player.faction ? player.faction.value : undefined,
                id: player.id,
                left: player.left,
                name: player.name,
                owner: player.owner,
                settings: player.user ? player.user.settings : {}
            };
        });

        return {
            allowSpectators: this.allowSpectators,
            clocks: this.clocks,
            createdAt: this.createdAt,
            gameType: this.gameType,
            id: this.id,
            messages: activePlayer ? this.gameChat.messages : undefined,
            name: this.name,
            needsPassword: !!this.password,
            node: this.node ? this.node.identity : undefined,
            owner: this.owner.username,
            players: playerSummaries,
            spectatorSquelch: this.spectatorSquelch,
            started: this.started,
            spectators: Object.values(this.spectators).map((spectator) => {
                return {
                    id: spectator.id,
                    name: spectator.name,
                    emailHash: spectator.emailHash,
                    settings: spectator.settings
                };
            })
        };
    }
}

export default PendingGame;
