import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { CardType, EventName, Location, Phases } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attach } from './GameActions/GameActions.js';
import { parseGameMode } from './GameMode.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';

export class PlayAttachmentAction extends PlayCardSourceAction {
    title = 'Play this attachment';

    constructor(card: DrawCard, ignoreType = false) {
        super(card, [payTargetDependentFateCost('target', ignoreType)], {
            location: [Location.PlayArea, Location.Provinces],
            gameAction: attach((context) => ({
                attachment: context.source,
                ignoreType: ignoreType,
                takeControl: context.source.controller !== context.player
            })),
            cardCondition: (card: BaseCard, context: AbilityContext) => context.source.canPlayOn(card)
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
            !context.player.isCardInPlayableLocation(context.source, context.playType)
        ) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !context.source.canPlay(context, context.playType)) {
            return 'cannotTrigger';
        }

        if(context.source.anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context: AbilityContext) {
        const t = context.target as BaseCard;
        const target = t.type === CardType.Province && t.isFacedown() ? t.location : t;
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, target);
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
            playType: context.playType
        });
        context.game.openEventWindow([
            context.game.actions
                .attach({ attachment: context.source, takeControl: context.source.controller !== context.player })
                .getEvent(context.target, context),
            cardPlayedEvent
        ]);
    }

    isCardPlayed() {
        return true;
    }
}
