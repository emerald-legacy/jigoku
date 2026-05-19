import type { AbilityContext } from './AbilityContext.js';
import BaseAction from './BaseAction.js';
import { EventNames, Phases, PlayTypes, TargetModes } from './Constants.js';
import { payTargetDependentFateCost } from './Costs.js';
import { attachToRing } from './GameActions/GameActions.js';
import { parseGameMode } from './GameMode.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type BaseCard from './basecard.js';
import type Ring from './ring.js';
import type DrawCard from './drawcard.js';

export class PlayAttachmentToRingAction extends BaseAction {
    title = 'Play this attachment';

    constructor(card: BaseCard) {
        super(card, [payTargetDependentFateCost('target')], {
            gameAction: attachToRing((context) => ({ attachment: context.source })),
            ringCondition: (ring: Ring, context: TriggeredAbilityContext<DrawCard>) => context.source.canPlayOn(ring),
            mode: TargetModes.Ring
        });
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements: string[] = []) {
        if(
            !ignoredRequirements.includes('phase') &&
            context.game.currentPhase === Phases.Dynasty &&
            !parseGameMode(context.game.gameMode).dynastyPhaseCanPlayAttachments
        ) {
            return 'phase';
        }
        if(
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, PlayTypes.PlayFromHand)
        ) {
            return 'location';
        }
        if(
            !ignoredRequirements.includes('cannotTrigger') &&
            !context.source.canPlay(context, PlayTypes.PlayFromHand)
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

    executeHandler(context: AbilityContext) {
        const cardPlayedEvent = context.game.getEvent(EventNames.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck:
                context.player && context.player.conflictDeck && context.player.conflictDeck[0] === context.source,
            onPlayCardSource: (context as any).onPlayCardSource,
            playType: PlayTypes.PlayFromHand
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
