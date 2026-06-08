import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { EventName, Phases, PlayType, TargetMode } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attachToRing } from './GameActions/GameActions.js';
import { parseGameMode } from './GameMode.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type Ring from './Ring.js';
import type DrawCard from './DrawCard.js';

export class PlayAttachmentToRingAction extends PlayCardSourceAction {
    title = 'Play this attachment';

    constructor(card: DrawCard) {
        super(card, [payTargetDependentFateCost('target')], {
            gameAction: attachToRing((context) => ({ attachment: context.source })),
            ringCondition: (ring: Ring, context: TriggeredAbilityContext<DrawCard>) => context.source.canPlayOn(ring),
            mode: TargetMode.Ring
        });
    }

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        if(
            !ignoredRequirements.includes('phase') &&
            context.game.currentPhase === Phases.Dynasty &&
            !parseGameMode(context.game.gameMode).dynastyPhaseCanPlayAttachments
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
        return super.meetsRequirements(context);
    }

    canResolveTargets() {
        return true;
    }

    displayMessage(context: AbilityContext) {
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, context.ring);
    }

    executeHandler(context: AbilityContext<DrawCard>) {
        const cardPlayedEvent = context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck:
                context.player && context.player.conflictDeck && context.player.conflictDeck[0] === context.source,
            onPlayCardSource: context.onPlayCardSource,
            playType: PlayType.PlayFromHand
        });
        context.game.openEventWindow([
            context.game.actions.attachToRing({ attachment: context.source }).getEvent(context.ring, context),
            cardPlayedEvent
        ]);
    }

    isCardPlayed() {
        return true;
    }
}
