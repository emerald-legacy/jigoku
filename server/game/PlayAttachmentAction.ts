import { msg } from './GameChat.js';
import type { AbilityContext } from './AbilityContext.js';
import { PlayCardSourceAction } from './PlayCardSourceAction.js';
import { CardType, Location, RestrictionType, type Blocker } from './Constants.js';
import { payTargetDependentFateCost } from './costs/fateAndHonorCosts.js';
import { attach } from './GameActions/GameActions.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import { createCardPlayedEvent } from './Events/cardPlayedEvent.js';
import { getAttachmentPlayBlocker } from './playActionHelpers.js';

export class PlayAttachmentAction extends PlayCardSourceAction {
    override title = 'Play this attachment';

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

    override meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        return getAttachmentPlayBlocker(context, ignoredBlockers) ?? super.meetsRequirements(context, ignoredBlockers);
    }

    override displayMessage(context: AbilityContext) {
        const t = context.target;
        const target = t && t.type === CardType.Province && t.isFacedown() ? t.location : t;
        context.game.addMessage(msg`${context.player} plays ${context.source}, attaching it to ${target}`);
    }

    override executeHandler(context: AbilityContext<DrawCard>) {
        const cardPlayedEvent = createCardPlayedEvent(context, context.source, context.playType);
        context.game.openEventWindow([
            attach({ attachment: context.source, takeControl: context.source.controller !== context.player })
                .getEvent(context.target, context),
            cardPlayedEvent
        ]);
    }

    override isCardPlayed() {
        return true;
    }
}
