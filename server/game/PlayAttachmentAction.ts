import type { AbilityContext } from './AbilityContext.js';
import BaseAction from './BaseAction.js';
import { CardType, EventName, Location, Phases } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attach } from './GameActions/GameActions.js';
import { parseGameMode } from './GameMode.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';

export class PlayAttachmentAction extends BaseAction {
    title = 'Play this attachment';

    constructor(card: BaseCard, ignoreType = false) {
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
            !context.player.isCardInPlayableLocation(context.source, context.playType)
        ) {
            return 'location';
        }
        if(!ignoredRequirements.includes('cannotTrigger') && !(context.source as DrawCard).canPlay(context, context.playType)) {
            return 'cannotTrigger';
        }

        if((context.source as DrawCard).anotherUniqueInPlay(context.player)) {
            return 'unique';
        }
        return super.meetsRequirements(context);
    }

    displayMessage(context: AbilityContext) {
        const t = context.target as BaseCard;
        const target = t.type === CardType.Province && t.isFacedown() ? t.location : t;
        context.game.addMessage('{0} plays {1}, attaching it to {2}', context.player, context.source, target);
    }

    executeHandler(context: AbilityContext) {
        const cardPlayedEvent = context.game.getEvent(EventName.OnCardPlayed, {
            player: context.player,
            card: context.source,
            context: context,
            originalLocation: context.source.location,
            originallyOnTopOfConflictDeck:
                context.player && context.player.conflictDeck && context.player.conflictDeck[0] === context.source,
            onPlayCardSource: (context as any).onPlayCardSource,
            playType: context.playType
        });
        context.game.openEventWindow([
            context.game.actions
                .attach({ attachment: context.source as DrawCard, takeControl: context.source.controller !== context.player })
                .getEvent(context.target, context),
            cardPlayedEvent
        ]);
    }

    isCardPlayed() {
        return true;
    }
}
