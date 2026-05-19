import { CardTypes } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FloatingWorld extends ProvinceCard {
    static id = 'floating-world';

    public setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            effect: 'dishonor {0}',
            target: {
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}
