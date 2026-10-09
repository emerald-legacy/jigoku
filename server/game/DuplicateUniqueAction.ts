import { msg } from './GameChat.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { Phase, PlayType, Blocker } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type DrawCard from './DrawCard.js';

export class DuplicateUniqueAction extends PlayCardSourceAction {
    title = 'Add fate to a duplicate';

    meetsRequirements(context: AbilityContext = this.createContext(), ignoredBlockers: Blocker[] = []): Blocker {
        if(!ignoredBlockers.includes(Blocker.Facedown) && this.card.isFacedown()) {
            return Blocker.Facedown;
        }

        if(!ignoredBlockers.includes(Blocker.WrongPhase) && this.card.game.currentPhase !== Phase.Dynasty) {
            return Blocker.WrongPhase;
        }

        if(!this.card.controller.isCardInPlayableLocation(this.card, PlayType.PlayFromProvince) && !this.card.controller.isCardInPlayableLocation(this.card, PlayType.PlayFromHand)) {
            if(!ignoredBlockers.includes(Blocker.WrongLocation)) {
                return Blocker.WrongLocation;
            }
        }
        if(!this.card.anotherUniqueInPlayControlledBy(context.player)) {
            return Blocker.DuplicateUnique;
        }
        if(!this.card.checkRestrictions('placeFate', context)) {
            return Blocker.CannotPlaceFate;
        }
        return super.meetsRequirements(context, ignoredBlockers);
    }

    displayMessage(context: AbilityContext): void {
        context.game.addMessage(msg`${context.player} discards a duplicate to add 1 fate to ${context.source}`);
    }

    executeHandler(context: AbilityContext<DrawCard>): void {
        const duplicate = context.player.getDuplicateInPlay(context.source);
        context.game.applyGameAction(context, { placeFate: duplicate, discardCard: context.source });
    }
}

