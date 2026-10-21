import { type MessageArgs } from '../../GameChat.js';
import { AllPlayerPrompt } from '../AllPlayerPrompt.js';
import type DrawCard from '../../DrawCard.js';
import type Game from '../../Game.js';
import type Player from '../../Player.js';

/** One mulligan: each player selects cards to replace, all at once; the decisions are posted once every player has decided (RRG Mulligan). */
export abstract class MulliganPrompt extends AllPlayerPrompt {
    selectedCards: Record<string, DrawCard[]> = {};
    selectableCards: Record<string, DrawCard[]> = {};
    #decisions = new Map<Player, MessageArgs>();

    constructor(game: Game) {
        super(game);
        game.getPlayers().forEach((player: Player) => this.selectedCards[player.name] = []);
    }

    /** "Dynasty" or "Conflict", for the prompt titles. */
    protected abstract readonly deckName: string;

    /** Whether `player` has decided. */
    protected abstract hasDecided(player: Player): boolean;

    protected abstract markDecided(player: Player): void;

    /** The cards `player` may mulligan. */
    protected abstract mulliganableCards(player: Player): DrawCard[];

    /** Replaces `cards` and returns the chat line for it. */
    protected abstract mulligan(player: Player, cards: DrawCard[]): MessageArgs;

    protected abstract keptMessage(player: Player): MessageArgs;

    /** After the player is done, whether or not they mulliganed. */
    protected afterDecision(_player: Player): void {}

    override completionCondition(player: Player): boolean {
        return this.hasDecided(player);
    }

    override continue(): boolean {
        if(!this.isComplete()) {
            this.game.getPlayers().forEach((player: Player) => {
                this.selectableCards[player.name] ??= this.mulliganableCards(player);
                player.setSelectableCards(this.selectableCards[player.name]);
            });
        }
        return super.continue();
    }

    override activePrompt() {
        return {
            selectCard: true,
            selectRing: true,
            menuTitle: `Select ${this.deckName.toLowerCase()} cards to mulligan`,
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: `${this.deckName} Mulligan`
        };
    }

    override waitingPrompt() {
        return { menuTitle: `Waiting for opponent to mulligan ${this.deckName.toLowerCase()} cards` };
    }

    override onCardClicked(player: Player, card: DrawCard): boolean {
        if(!player || !this.activeCondition(player) || !card || !this.selectableCards[player.name]?.includes(card)) {
            return false;
        }
        const selected = this.selectedCards[player.name];
        this.selectedCards[player.name] = selected.includes(card) ? selected.filter((c) => c !== card) : [...selected, card];
        player.setSelectedCards(this.selectedCards[player.name]);
        return true;
    }

    override menuCommand(player: Player, arg: string): boolean {
        if(arg !== 'done') {
            return false;
        }
        const cards = this.selectedCards[player.name];
        this.#decisions.set(player, cards.length > 0 ? this.mulligan(player, cards) : this.keptMessage(player));
        this.afterDecision(player);
        player.clearSelectedCards();
        player.clearSelectableCards();
        this.markDecided(player);
        this.#postDecisions();
        return true;
    }

    #postDecisions(): void {
        const players = this.game.getPlayersInFirstPlayerOrder();
        if(!players.every((player) => this.hasDecided(player))) {
            return;
        }
        for(const player of players) {
            const message = this.#decisions.get(player);
            if(message) {
                this.game.addMessage(message);
            }
        }
    }
}
