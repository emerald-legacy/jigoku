import { AbilityType, EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export default class CourtesyAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: EventPayload<EventName.OnCardLeavesPlay>, context: TriggeredAbilityContext<DrawCard>) => event.card === context.source &&
                                                      context.source.hasCourtesy()
            },
            title: card.name + '\'s Courtesy',
            printedAbility: false,
            message: '{0} gains a fate due to {1}\'s Courtesy',
            messageArgs: (context: TriggeredAbilityContext) => [context.player, context.source],
            handler: (context: TriggeredAbilityContext) => this.game.applyGameAction(context, { gainFate: context.player })
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
