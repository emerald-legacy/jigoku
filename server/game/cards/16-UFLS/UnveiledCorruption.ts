import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { CardType } from '../../Constants.js';

class UnveiledCorruption extends DrawCard {
    static id = 'unveiled-corruption';

    override setupCardAbilities() {
        this.action('Force opponent to discard cards to match your hand size')
            .cost(costs.taint({ cardCondition: (card) => {
                return card.type === CardType.Province && !(card.isProvinceCard() && card.isBroken);
            }}))
            .chosenDiscard((context) => ({
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - context.player.hand.filter((card) => card !== context.source).length)
            }));
    }
}


export default UnveiledCorruption;
