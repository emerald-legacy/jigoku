import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { Phase, PlayType, TargetMode, Blocker } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attachToRing } from './GameActions/GameActions.js';
import type Ring from './Ring.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';

export class PlayAttachmentToRingAction extends PlayCardSourceAction {
    title = 'Play this attachment';

    constructor(card: DrawCard) {
        super(card, [payTargetDependentFateCost('target')], {
            gameAction: attachToRing((context: AbilityContext<DrawCard>) => ({ attachment: context.source })),
            ringCondition: (ring: Ring) => card.canPlayOn(ring),
            mode: TargetMode.Ring
        });
    }

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        if(
            !ignoredBlockers.includes(Blocker.WrongPhase) &&
            context.game.currentPhase === Phase.Dynasty &&
            !context.game.rules.dynastyPhaseCanPlayAttachments
        ) {
            return Blocker.WrongPhase;
        }
        if(
            !ignoredBlockers.includes(Blocker.WrongLocation) &&
            !context.player.isCardInPlayableLocation(context.source, PlayType.PlayFromHand)
        ) {
            return Blocker.WrongLocation;
        }
        if(
            !ignoredBlockers.includes(Blocker.CannotTrigger) &&
            !context.source.canPlay(context, PlayType.PlayFromHand)
        ) {
            return Blocker.CannotTrigger;
        }

        if(context.source.anotherUniqueInPlay(context.player)) {
            return Blocker.DuplicateUnique;
        }
        return super.meetsRequirements(context, ignoredBlockers);
    }

    canResolveTargets() {
        return true;
    }

    displayMessage(context: AbilityContext) {
        context.game.addMessage(msg`${context.player} plays ${context.source}, attaching it to ${context.ring}`);
    }

    executeHandler(context: AbilityContext<DrawCard>) {
        const cardPlayedEvent = createCardPlayedEvent(context, context.source, PlayType.PlayFromHand);
        context.game.openEventWindow([
            context.game.actions.attachToRing({ attachment: context.source }).getEvent(context.ring, context),
            cardPlayedEvent
        ]);
    }

    isCardPlayed() {
        return true;
    }
}
