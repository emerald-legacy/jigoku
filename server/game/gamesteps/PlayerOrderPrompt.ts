import type Player from '../Player.js';
import { UiPrompt } from './UiPrompt.js';

/**
 * Represents a UI Prompt that prompts each player individually in first-player
 * order. Inheritors should call completePlayer() when the prompt for the
 * current player has been completed. Overriding skipCondition will exclude
 * any matching players from the prompt.
 */
export class PlayerOrderPrompt extends UiPrompt {
    players: Player[] | undefined;

    public get currentPlayer() {
        this.lazyFetchPlayers();
        return (this.players ?? [])[0];
    }

    private lazyFetchPlayers(): void {
        if(!this.players) {
            this.players = this.game.getPlayersInFirstPlayerOrder();
        }
    }

    private skipPlayers(): void {
        this.lazyFetchPlayers();
        this.players = (this.players ?? []).filter((p) => !this.skipCondition(p));
    }

    private skipCondition(_player: Player): boolean {
        return false;
    }

    protected completePlayer(): void {
        this.lazyFetchPlayers();
        (this.players ?? []).shift();
    }

    public isComplete(): boolean {
        this.lazyFetchPlayers();
        return (this.players ?? []).length === 0;
    }

    public activeCondition(player: Player): boolean {
        return player === this.currentPlayer;
    }

    public continue(): boolean {
        this.skipPlayers();
        return super.continue();
    }
}
