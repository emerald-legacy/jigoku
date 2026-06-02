import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FuneralPyre extends DrawCard {
    static id = 'funeral-pyre';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Sacrifice a character to draw',
            cost: ability.costs.sacrifice({ cardType: CardType.Character }),
            gameAction: ability.actions.draw()
        });
    }
}


export default FuneralPyre;
