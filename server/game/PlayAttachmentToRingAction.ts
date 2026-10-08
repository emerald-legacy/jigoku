import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { Phase, PlayType, TargetMode } from './Constants.js';
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

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        if(
            !ignoredRequirements.includes('phase') &&
            context.game.currentPhase === Phase.Dynasty &&
            !context.game.rules.dynastyPhaseCanPlayAttachments
        ) {
            return 'phase';
        }
        if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, PlayType.PlayFromHand)
        ) {
            return 'location';
        }
        if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !context.source.canPlay(context, PlayType.PlayFromHand)
        ) {
            return 'cannotTrigger';
        }

        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context, ignoredRequirements);
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
