import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Resourcefulness extends DrawCard {
    static id = 'resourcefulness';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            cost: AbilityDsl.costs.dishonor(),
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default Resourcefulness;
