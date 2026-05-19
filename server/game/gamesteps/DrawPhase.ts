import { EffectNames, Phases } from '../Constants.js';
import { draw } from '../GameActions/GameActions.js';
import type Game from '../game.js';
import { Phase } from './Phase.js';
import { SimpleStep } from './SimpleStep.js';
import ActionWindow from './actionwindow.js';
import HonorBidPrompt from './honorbidprompt.js';

/**
 * II Draw Phase
 * 2.1 Draw phase begins.
 * 2.2 Honor bid.
 * 2.3 Reveal honor dials.
 * 2.4 Transfer honor.
 * 2.5 Draw cards.
 *     ACTION WINDOW
 * 2.6 Draw phase ends.
 */
export class DrawPhase extends Phase {
    constructor(game: Game) {
        super(game, Phases.Draw);
        this.initialise([
            new SimpleStep(game, () => this.displayHonorBidPrompt()),
            new SimpleStep(game, () => this.drawConflictCards()),
            new ActionWindow(this.game, 'Action Window', 'draw')
        ]);
    }

    displayHonorBidPrompt() {
        this.game.queueStep(new HonorBidPrompt(this.game, 'Choose how much honor to bid in the draw phase'));
    }

    drawConflictCards() {
        for(let player of this.game.getPlayers()) {
            const min = player.honorBid === 0 ? 0 : 1;
            const amount = Math.max(player.honorBid + player.sumEffects(EffectNames.ModifyCardsDrawnInDrawPhase), min);
            this.game.addMessage('{0} draws {1} cards for the draw phase', player, amount);
            draw({ amount }).resolve(player, this.game.getFrameworkContext());
        }
    }
}
