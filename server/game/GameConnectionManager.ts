import Player from './Player.js';
import { Spectator } from './Spectator.js';
import type Game from './Game.js';
import type Socket from '../Socket.js';
import type { GamePlayerUser } from './Player.js';
import type { LobbyUser, UserIdentity } from '../gamenode/LobbyProtocol.js';

export class GameConnectionManager {
    constructor(private readonly game: Game) {}

    watch(socketId: string, user: UserIdentity): boolean {
        const game = this.game;
        if(!game.allowSpectators) {
            return false;
        }

        game.playersAndSpectators[user.username] = new Spectator(socketId, user);
        game.invalidatePlayerCaches();
        game.addMessage('{0} has joined the game as a spectator', user.username);

        return true;
    }

    join(socketId: string, user: LobbyUser): boolean {
        const game = this.game;
        if(game.started || game.getPlayers().length === 2) {
            return false;
        }

        game.playersAndSpectators[user.username] = new Player(socketId, user as GamePlayerUser, game.owner === user.username, game);
        game.invalidatePlayerCaches();

        return true;
    }

    isEmpty(): boolean {
        return Object.values(this.game.playersAndSpectators).every(
            (player) => player.disconnected || player.left || player.id === 'TBA'
        );
    }

    allPlayersGone(): boolean {
        return this.game.started && this.game.getPlayers().every(
            (player) => player.disconnected || player.left
        );
    }

    leave(playerName: string): void {
        const game = this.game;
        const player = game.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        game.addMessage('{0} has left the game', playerName);

        if(game.isSpectator(player) || !game.started) {
            delete game.playersAndSpectators[playerName];
            game.invalidatePlayerCaches();
        } else {
            player.left = true;

            if(!game.finishedAt) {
                game.finishedAt = new Date();
            }
        }
    }

    disconnect(playerName: string): void {
        const game = this.game;
        const player = game.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        game.addMessage('{0} has disconnected', player);

        if(game.isSpectator(player)) {
            delete game.playersAndSpectators[playerName];
            game.invalidatePlayerCaches();
        } else {
            player.disconnected = true;
        }

        player.socket = undefined;
    }

    failedConnect(playerName: string): void {
        const game = this.game;
        const player = game.playersAndSpectators[playerName];

        if(!player) {
            return;
        }

        if(game.isSpectator(player) || !game.started) {
            delete game.playersAndSpectators[playerName];
            game.invalidatePlayerCaches();
        } else {
            game.addMessage('{0} has failed to connect to the game', player);

            player.disconnected = true;

            if(!game.finishedAt) {
                game.finishedAt = new Date();
            }
        }
    }

    reconnect(socket: Socket, playerName: string): void {
        const player = this.game.getPlayerByName(playerName);
        if(!player) {
            return;
        }

        player.id = socket.id;
        player.socket = socket;
        player.disconnected = false;

        this.game.addMessage('{0} has reconnected', player);
    }
}
