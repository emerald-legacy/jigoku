import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { Phases, PlayType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type DrawCard from './DrawCard.js';

class DuplicateUniqueAction extends PlayCardSourceAction {
    title = 'Add fate to a duplicate';

    constructor(card: DrawCard) {
        super(card);
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []): string {
        if(!ignoredRequirements.includes('facedown') && this.card.isFacedown()) {
            return 'facedown';
        }

        if(!ignoredRequirements.includes('phase') && this.card.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        }

        if(!this.card.controller.isCardInPlayableLocation(this.card, PlayType.PlayFromProvince) && !this.card.controller.isCardInPlayableLocation(this.card, PlayType.PlayFromHand)) {
            if(!ignoredRequirements.includes('location')) {
                return 'location';
            }
        }
        if(!this.card.anotherUniqueInPlayControlledBy(context.player)) {
            return 'unique';
        }
        if(!this.card.checkRestrictions('placeFate', context)) {
            return 'restriction';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context: AbilityContext): void {
        context.game.addMessage('{0} discards a duplicate to add 1 fate to {1}', context.player, context.source);
    }

    executeHandler(context: AbilityContext<DrawCard>): void {
        const duplicate = context.player.getDuplicateInPlay(context.source);
        context.game.applyGameAction(context, { placeFate: duplicate, discardCard: context.source });
    }
}

export default DuplicateUniqueAction;
