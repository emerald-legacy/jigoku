import * as AbilityLimit from '../AbilityLimit.js';
import { AbilityTypes } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../drawcard.js';
import type Game from '../game.js';
import TriggeredAbility from '../triggeredability.js';

export default class PrideAbility extends TriggeredAbility {
    constructor(game: Game, card: DrawCard) {
        super(game, card, AbilityTypes.KeywordReaction, {
            when: {
                afterConflict: (event: any, context: TriggeredAbilityContext) => context.source.isParticipating() && context.source.hasPride() &&
                                                   ((event.conflict.winner === context.player && context.source.allowGameAction('honor', context)) ||
                                                   (event.conflict.loser === context.player && context.source.allowGameAction('dishonor', context)))
            },
            title: card.name + '\'s Pride',
            printedAbility: false,
            message: '{0} is {1}honored due to their Pride',
            messageArgs: (context: TriggeredAbilityContext) => [context.source, context.event.conflict.winner === context.player ? '' : 'dis'],
            limit: AbilityLimit.perConflict(1),
            handler: (context: TriggeredAbilityContext) => {
                if(context.event.conflict.winner === context.player) {
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
