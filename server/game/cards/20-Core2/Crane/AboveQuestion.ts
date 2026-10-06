import { cardCannot } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class AboveQuestion extends DrawCard {
    static id = 'above-question';

    setupCardAbilities() {
        this.whileAttached({
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsEvents',
                source: this
            })
        });
    }
}
