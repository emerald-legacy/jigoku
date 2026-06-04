import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import { ProvinceCard } from '../../ProvinceCard.js';

class UnveiledCorruption extends DrawCard {
    static id = 'unveiled-corruption';

    setupCardAbilities() {
        this.action({
            title: 'Force opponent to discard cards to match your hand size',
            cost: AbilityDsl.costs.taint({ cardCondition: (card: BaseCard) => {
                return card.type === CardType.Province && !(card instanceof ProvinceCard && card.isBroken);
            }}),
            gameAction: AbilityDsl.actions.chosenDiscard(context => ({
                target: context.player.opponent,
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - context.player.hand.filter((card: DrawCard) => card !== context.source).length)
            }))
        });
    }
}


export default UnveiledCorruption;
