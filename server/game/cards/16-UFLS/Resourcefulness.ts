import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { honor } from '../../GameActions/GameActions.js';

class Resourcefulness extends DrawCard {
    static id = 'resourcefulness';

    setupCardAbilities() {
        this.action('Honor a character')
            .cost(AbilityDsl.costs.dishonor())
            .target({
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character
            }, honor());
    }
}


export default Resourcefulness;
