import { AbilityTypes } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../drawcard.js';
import TriggeredAbility from '../triggeredability.js';

import type { Event } from '../Events/Event.js';
export default class PersonalHonorAbility extends TriggeredAbility {
    constructor(card: DrawCard) {
        super(card, AbilityTypes.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: Event, context: TriggeredAbilityContext) => event.card === context.source &&
                                                      context.source.allowGameAction('affectedByHonor') &&
                                                      (context.source.isHonored || context.source.isDishonored)
            },
            title: card.name + '\'s Personal Honor',
            printedAbility: false,
            message: '{0} {1} 1 honor due to {2}\'s personal honor',
            messageArgs: (context: TriggeredAbilityContext) => [context.player, context.source.isHonored ? 'gains' : 'loses', context.source],
            handler: (context: TriggeredAbilityContext) => {
                if(context.source.isHonored) {
                    this.game.applyGameAction(context, { gainHonor: context.player });
                } else if(context.source.isDishonored) {
                    this.game.applyGameAction(context, { loseHonor: context.player });
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
