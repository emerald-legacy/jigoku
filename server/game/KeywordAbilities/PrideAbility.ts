import { msg } from '../GameChat.js';
import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityType, type EventName } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { TriggeredAbility } from '../TriggeredAbility.js';

import type { EventPayload } from '../Events/EventPayloads.js';
import { dishonor, honor } from '../GameActions/GameActions.js';
export class PrideAbility extends TriggeredAbility<DrawCard> {
    constructor(card: DrawCard) {
        super(card, AbilityType.KeywordReaction, {
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context: TriggeredAbilityContext<DrawCard>) => {
                    // "this character wins": its side wins, whoever controls it (Endless Plains Skirmisher)
                    const conflict = event.conflict;
                    return context.source.hasPride() &&
                        ((conflict.isOnWinningSide(context.source) && context.source.allowGameAction('honor', context)) ||
                         (conflict.isOnLosingSide(context.source) && context.source.allowGameAction('dishonor', context)));
                }
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            message: (context: TriggeredAbilityContext) => context.event.conflict?.isOnWinningSide(card)
                ? msg`${context.source} is honored due to their Pride`
                : msg`${context.source} is dishonored due to their Pride`,
            limit: AbilityLimit.perConflict(1),
            handler: (context: TriggeredAbilityContext) => {
                const conflict = context.event.conflict;
                if(!conflict) {
                    return;
                }
                if(conflict.isOnWinningSide(card)) {
                    this.game.resolveActions([honor({ target: context.source })], context);
                } else {
                    this.game.resolveActions([dishonor({ target: context.source })], context);
                }
            }
        });
    }

    override isTriggeredAbility() {
        return false;
    }

    override isKeywordAbility() {
        return true;
    }
}
