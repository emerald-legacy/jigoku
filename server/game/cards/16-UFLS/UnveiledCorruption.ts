import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes } from '../../Constants';

class UnveiledCorruption extends DrawCard {
    static id = 'unveiled-corruption';

    setupCardAbilities() {
        this.action({
            title: 'Force opponent to discard cards to match your hand size',
            cost: AbilityDsl.costs.taint({ cardCondition: card => {
                return card.type === CardTypes.Province && !card.isBroken;
            }}),
            gameAction: AbilityDsl.actions.chosenDiscard(context => ({
                target: context.player.opponent,
                amount: Math.max(0, context.player.opponent.hand.length - context.player.hand.filter(card => card !== context.source).length)
            }))
        });
    }
}


export default UnveiledCorruption;
