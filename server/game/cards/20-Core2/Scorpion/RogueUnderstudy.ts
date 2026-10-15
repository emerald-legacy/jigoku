import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';

export default class RogueUnderstudy extends DrawCard {
    static id = 'rogue-understudy';

    setupCardAbilities() {
        this.action('Lose 1 honor to ready me')
            .cost(costs.payHonor(1))
            .ready();
    }
}
