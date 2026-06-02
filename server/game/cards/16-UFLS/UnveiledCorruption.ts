import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class UnveiledCorruption extends DrawCard {
    static id = 'unveiled-corruption';

    setupCardAbilities() {
        this.action({
            title: 'Force opponent to discard cards to match your hand size',
            cost: AbilityDsl.costs.taint({ cardCondition: (card: any) => {
                return card.type === CardType.Province && !card.isBroken;
            }}),
            gameAction: AbilityDsl.actions.chosenDiscard(context => ({
                target: context.player.opponent,
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - context.player.hand.filter((card: any) => card !== context.source).length)
            }))
        });
    }
}


export default UnveiledCorruption;
