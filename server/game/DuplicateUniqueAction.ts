import { msg } from './GameChat.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { Phase, PlayType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type DrawCard from './DrawCard.js';

export class DuplicateUniqueAction extends PlayCardSourceAction {
    title = 'Add fate to a duplicate';

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredRequirements: string[] = []): string {
        if(!ignoredRequirements.includes('facedown') && this.card.isFacedown()) {
            return 'facedown';
        }

        if(!ignoredRequirements.includes('phase') && this.card.game.currentPhase !== Phase.Dynasty) {
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
        return super.meetsRequirements(context, ignoredRequirements);
    }

    displayMessage(context: AbilityContext): void {
        context.game.addMessage(msg`${context.player} discards a duplicate to add 1 fate to ${context.source}`);
    }

    executeHandler(context: AbilityContext<DrawCard>): void {
        const duplicate = context.player.getDuplicateInPlay(context.source);
        context.game.applyGameAction(context, { placeFate: duplicate, discardCard: context.source });
    }
}

