import { msg } from '../../../GameChat.js';
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
                        message: (_context, target, player) => msg`${player} chooses to honor ${target}`
                    },
                    'Dishonor this character': {
                        action: dishonor(),
                        message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
                    }
                }
            }))
            .chatText('honor or dishonor {0}');
    }
}
