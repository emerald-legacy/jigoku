import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SteadfastWitchHunter extends DrawCard {
    static id = 'steadfast-witch-hunter';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Ready character',
            cost: ability.costs.sacrifice({ cardType: CardType.Character }),
            target: {
                activePromptTitle: 'Choose a character to ready',
                cardType: CardType.Character,
                gameAction: ability.actions.ready()
            }
        });
    }
}


export default SteadfastWitchHunter;
