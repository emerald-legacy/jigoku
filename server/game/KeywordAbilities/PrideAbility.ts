import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityType, EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
export default class PrideAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<DrawCard>) => {
                    const conflict = event.conflict;
                    return context.source.isParticipating() && context.source.hasPride() &&
                        ((conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                         (conflict.loser === context.player && context.source.allowGameAction('dishonor', context)));
                }
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            message: '{0} is {1}honored due to their Pride',
            messageArgs: (context: TriggeredAbilityContext) => [context.source, context.event.conflict?.winner === context.player ? '' : 'dis'],
            limit: AbilityLimit.perConflict(1),
            handler: (context: TriggeredAbilityContext) => {
                const conflict = context.event.conflict;
                if(!conflict) {
                    return;
                }
                if(conflict.winner === context.player) {
                    this.game.applyGameAction(context, { honor: context.source });
                } else {
                    this.game.applyGameAction(context, { dishonor: context.source });
                }
            }
        });
    }

    isTriggeredAbility() {
        return false;
    }

    isKeywordAbility() {
        return true;
    }
}
