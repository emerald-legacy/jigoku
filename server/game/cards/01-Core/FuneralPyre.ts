import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class FuneralPyre extends DrawCard {
    static id = 'funeral-pyre';

    setupCardAbilities() {
        this.action('Sacrifice a character to draw')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(AbilityDsl.actions.draw());
    }
}


export default FuneralPyre;
