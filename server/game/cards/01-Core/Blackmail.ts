import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { takeControl } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';

class Blackmail extends DrawCard {
    static id = 'blackmail';

    setupCardAbilities() {
        this.conflictAction('Take control of a character')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3)
            }, cardLastingEffect(context => ({
                effect: takeControl(context.player)
            })))
            .chatText('take control of {0}');
    }

    canPlay(context: AbilityContext, playType = 'play'): boolean {
        if(context.player.opponent && context.player.isLessHonorable()) {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default Blackmail;
