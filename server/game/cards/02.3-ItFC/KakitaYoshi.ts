import * as costs from '../../costs/index.js';
import { reduceCost } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class KakitaYoshi extends DrawCard {
    static id = 'kakita-yoshi';

    override setupCardAbilities() {
        this.action('Draw 3 cards')
            .condition((context) => context.source.isParticipating())
            .cost(costs.discardImperialFavor())
            .draw(3)
            .playerLastingEffect({
                effect: reduceCost({
                    amount: 2,
                    match: (card) => card.type === CardType.Event
                })
            })
            .chatText('draw 3 cards, and reduce the cost of events this conflict');
    }
}


export default KakitaYoshi;
