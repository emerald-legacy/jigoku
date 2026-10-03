import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class MantisTenkinja extends DrawCard {
    static id = 'mantis-tenkinja';

    setupCardAbilities() {
        this.interrupt('Reduce cost of next event')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event && event.player === context.player &&
                    !!event.context &&
                    (event.context.ability.getReducedCost?.(event.context) ?? 0) > 0
            })
            .cost(AbilityDsl.costs.payHonor(1))
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, (card) => card === context.event.card)
            })))
            .effect('reduce the cost of their next event by 1');
    }
}


export default MantisTenkinja;
