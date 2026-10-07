import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { chosenDiscard } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';

class UnveiledCorruption extends DrawCard {
    static id = 'unveiled-corruption';

    setupCardAbilities() {
        this.action('Force opponent to discard cards to match your hand size')
            .cost(costs.taint({ cardCondition: (card) => {
                return card.type === CardType.Province && !(card instanceof ProvinceCard && card.isBroken);
            }}))
            .gameAction(chosenDiscard(context => ({
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - context.player.hand.filter((card) => card !== context.source).length)
            })));
    }
}


export default UnveiledCorruption;
