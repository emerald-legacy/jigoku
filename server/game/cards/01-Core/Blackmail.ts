import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { takeControl } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class Blackmail extends DrawCard {
    static id = 'blackmail';

    override setupCardAbilities() {
        this.action('Take control of a character')
            .condition((context) => context.game.isDuringConflict())
            .playOnlyIf((context) => !!context.player.opponent && context.player.isLessHonorable())
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => !card.anotherUniqueInPlay(context.player) && card.costLessThan(3)
            }, cardLastingEffect((context) => ({
                effect: takeControl(context.player)
            })))
            .chatText('take control of {0}');
    }
}


export default Blackmail;
