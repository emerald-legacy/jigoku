import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class KakitaYoshi extends DrawCard {
    static id = 'kakita-yoshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Draw 3 cards')
            .cost(ability.costs.discardImperialFavor())
            .condition(context => context.source.isParticipating())
            .gameAction(ability.actions.draw({ amount: 3 }), ability.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: ability.effects.reduceCost({
                    amount: 2,
                    match: (card: DrawCard) => card.type === CardType.Event
                })
            })))
            .effect('draw 3 cards, and reduce the cost of events this conflict');
    }
}


export default KakitaYoshi;
