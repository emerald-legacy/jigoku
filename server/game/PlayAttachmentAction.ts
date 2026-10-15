import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { CardType, Location, Phase, Blocker, RestrictionType } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attach } from './GameActions/GameActions.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { getPlayBlocker } from './playActionHelpers.js';

export class PlayAttachmentAction extends PlayCardSourceAction {
    title = 'Play this attachment';

    constructor(card: DrawCard, ignoreType = false) {
        super(card, [payTargetDependentFateCost('target', ignoreType)], {
            location: [Location.PlayArea, Location.Provinces],
            gameAction: attach((context: AbilityContext<DrawCard>) => ({
                attachment: context.source,
                ignoreType: ignoreType,
                takeControl: context.source.controller !== context.player
            })),
            // only playing checks this; putting into play and moving bypass it (RRG "Play and Put into Play")
            cardCondition: (card: BaseCard, context: AbilityContext) =>
                context.source.canPlayOn(card) && card.checkRestrictions(RestrictionType.Play, context)
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
        return getPlayBlocker(context.source, context, ignoredBlockers, context.playType) ?? super.meetsRequirements(context, ignoredBlockers);
    }

    displayMessage(context: AbilityContext) {
        const t = context.target;
        const target = t && t.type === CardType.Province && t.isFacedown() ? t.location : t;
        context.game.addMessage(msg`${context.player} plays ${context.source}, attaching it to ${target}`);
    }

    executeHandler(context: AbilityContext<DrawCard>) {
        const cardPlayedEvent = createCardPlayedEvent(context, context.source, context.playType);
        context.game.openEventWindow([
            attach({ attachment: context.source, takeControl: context.source.controller !== context.player })
                .getEvent(context.target, context),
            cardPlayedEvent
        ]);
    }

    isCardPlayed() {
        return true;
    }
}
