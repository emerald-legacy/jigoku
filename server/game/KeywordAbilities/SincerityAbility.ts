import { AbilityTypes } from '../Constants.js';
import type { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type DrawCard from '../drawcard.js';
import type Game from '../game.js';
import TriggeredAbility from '../triggeredability.js';

export default class SincerityAbility extends TriggeredAbility {
    constructor(game: Game, card: DrawCard) {
        super(game, card, AbilityTypes.KeywordInterrupt, {
            when: {
                onCardLeavesPlay: (event: any, context: TriggeredAbilityContext) => event.card === context.source &&
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
