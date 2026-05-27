import { AbilityTypes } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../drawcard.js';
import TriggeredAbility from '../triggeredability.js';

import type { Event } from '../Events/Event.js';
export default class SincerityAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityTypes.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: Event, context: TriggeredAbilityContext) => event.card === context.source &&
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
