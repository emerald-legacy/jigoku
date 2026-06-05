import * as AbilityLimit from '../AbilityLimit.js';
import type { Conflict } from '../Conflict.js';
import { AbilityType, EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import TriggeredAbility from '../TriggeredAbility.js';

import type { Event } from '../Events/Event.js';
import type { GameEvent } from '../Events/EventPayloads.js';
export default class PrideAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                afterConflict: (event: Event, context: TriggeredAbilityContext) => {
                    const conflict = (event as GameEvent<EventName.AfterConflict>).conflict;
                    return (context.source as DrawCard).isParticipating() && (context.source as DrawCard).hasPride() &&
                        ((conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                         (conflict.loser === context.player && context.source.allowGameAction('dishonor', context)));
                }
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            message: '{0} is {1}honored due to their Pride',
            messageArgs: (context: TriggeredAbilityContext) => [context.source, (context.event.conflict as Conflict).winner === context.player ? '' : 'dis'],
            limit: AbilityLimit.perConflict(1),
            handler: (context: TriggeredAbilityContext) => {
                if((context.event.conflict as Conflict).winner === context.player) {
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
