import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class MantisTenkinja extends DrawCard {
    static id = 'mantis-tenkinja';

    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardTypes.Event && event.player === context.player &&
                    event.context.ability.getReducedCost(event.context) > 0
            },
            cost: ability.costs.payHonor(1),
            effect: 'reduce the cost of their next event by 1',
            gameAction: ability.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: ability.effects.reduceNextPlayedCardCost(1, card => card === context.event.card)
            }))
        });
    }
}


export default MantisTenkinja;
