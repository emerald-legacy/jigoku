import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { dishonor } from '../../../GameActions/GameActions.js';

export default class FloatingWorld extends ProvinceCard {
    static id = 'floating-world';

    public setupCardAbilities() {
        this.action('Dishonor a character')
            .target({
                activePromptTitle: 'Choose a character to dishonor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, dishonor())
            .effect('dishonor {0}');
    }
}
