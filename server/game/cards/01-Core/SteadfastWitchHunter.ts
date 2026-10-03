import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SteadfastWitchHunter extends DrawCard {
    static id = 'steadfast-witch-hunter';

    setupCardAbilities() {
        this.action('Ready character')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .target('target', {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardType.Character
            }, AbilityDsl.actions.ready());
    }
}


export default SteadfastWitchHunter;
