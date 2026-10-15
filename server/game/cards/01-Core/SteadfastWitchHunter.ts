import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { ready } from '../../GameActions/GameActions.js';

class SteadfastWitchHunter extends DrawCard {
    static id = 'steadfast-witch-hunter';

    setupCardAbilities() {
        this.action('Ready character')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .target({
                activePromptTitle: 'Choose a character to ready',
                cardType: CardType.Character
            }, ready());
    }
}


export default SteadfastWitchHunter;
