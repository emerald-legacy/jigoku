import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { chooseAction, dishonor, honor } from '../../../GameActions/GameActions.js';

export default class ForestOfRustlingWhispers extends ProvinceCard {
    static id = 'forest-of-rustling-whispers';

    public setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .target({
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, chooseAction({
                options: {
                    'Honor this character': {
                        action: honor(),
                        message: '{0} chooses to honor {1}'
                    },
                    'Dishonor this character': {
                        action: dishonor(),
                        message: '{0} chooses to dishonor {1}'
                    }
                }
            }))
            .chatText('honor or dishonor {0}');
    }
}
