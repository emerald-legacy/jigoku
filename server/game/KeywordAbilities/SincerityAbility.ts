import { AbilityType, EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export default class SincerityAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context: TriggeredAbilityContext<DrawCard>) => event.card === context.source &&
                                                      context.source.hasSincerity()
            },
            title: card.name + '\'s Sincerity',
            printedAbility: false,
            message: '{0} draws a card due to {1}\'s Sincerity',
            messageArgs: (context: TriggeredAbilityContext) => [context.player, context.source],
            handler: (context: TriggeredAbilityContext) => context.game.applyGameAction(context, { draw: context.player })
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
