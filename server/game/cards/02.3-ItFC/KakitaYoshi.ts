import * as costs from '../../costs/index.js';
import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class KakitaYoshi extends DrawCard {
    static id = 'kakita-yoshi';

    setupCardAbilities() {
        this.action('Draw 3 cards')
            .cost(costs.discardImperialFavor())
            .condition(context => context.source.isParticipating())
            .draw(3)
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceCost({
                    amount: 2,
                    match: (card) => card.type === CardType.Event
                })
            }))
            .effect('draw 3 cards, and reduce the cost of events this conflict');
    }
}


export default KakitaYoshi;
