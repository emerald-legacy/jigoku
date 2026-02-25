import BaseAction from './BaseAction';
import { Phases, PlayTypes } from './Constants';
import type { AbilityContext } from './AbilityContext';
import type BaseCard from './basecard';

class DuplicateUniqueAction extends BaseAction {
    title = 'Add fate to a duplicate';

    constructor(card: BaseCard) {
        super(card);
    }

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []): string | undefined {
        if(!ignoredRequirements.includes('facedown') && this.card.isFacedown()) {
            return 'facedown';
        }

        if(!ignoredRequirements.includes('phase') && this.card.game.currentPhase !== Phases.Dynasty) {
            return 'phase';
        }

        if(!this.card.controller.isCardInPlayableLocation(this.card, PlayTypes.PlayFromProvince) && !this.card.controller.isCardInPlayableLocation(this.card, PlayTypes.PlayFromHand)) {
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

    executeHandler(context: AbilityContext): void {
        const duplicate = context.player.getDuplicateInPlay(context.source);
        context.game.applyGameAction(context, { placeFate: duplicate, discardCard: context.source });
    }
}

export = DuplicateUniqueAction;
