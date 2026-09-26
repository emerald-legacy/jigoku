import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type BaseAction from '../../BaseAction.js';
import { CardType } from '../../Constants.js';

class MantisTenkinja extends DrawCard {
    static id = 'mantis-tenkinja';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.interrupt('Reduce cost of next event')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.type === CardType.Event && event.player === context.player &&
                    !!event.context &&
                    ((event.context.ability as BaseAction).getReducedCost?.(event.context) ?? 0) > 0
            })
            .cost(ability.costs.payHonor(1))
            .gameAction(ability.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: ability.effects.reduceNextPlayedCardCost(1, (card: DrawCard) => card === context.event.card)
            })))
            .effect('reduce the cost of their next event by 1');
    }
}


export default MantisTenkinja;
