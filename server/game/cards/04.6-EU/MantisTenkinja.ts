import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class MantisTenkinja extends DrawCard {
    static id = 'mantis-tenkinja';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === CardTypes.Event && event.player === context.player &&
                    !!event.context &&
                    ((event.context.ability as any).getReducedCost?.(event.context) ?? 0) > 0
            },
            cost: ability.costs.payHonor(1),
            effect: 'reduce the cost of their next event by 1',
            gameAction: ability.actions.playerLastingEffect((context: any) => ({
                targetController: context.player,
                effect: ability.effects.reduceNextPlayedCardCost(1, (card: any) => card === context.event.card)
            }))
        });
    }
}


export default MantisTenkinja;
