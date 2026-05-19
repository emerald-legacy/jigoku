import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class FuneralPyre extends DrawCard {
    static id = 'funeral-pyre';

    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice({ cardType: CardTypes.Character }),
            gameAction: ability.actions.draw()
        });
    }
}


export default FuneralPyre;
