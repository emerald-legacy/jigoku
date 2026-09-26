import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ForestOfRustlingWhispers extends ProvinceCard {
    static id = 'forest-of-rustling-whispers';

    public setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .target('target', {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.chooseAction({
                options: {
                    'Honor this character': {
                        action: AbilityDsl.actions.honor(),
                        message: '{0} chooses to honor {1}'
                    },
                    'Dishonor this character': {
                        action: AbilityDsl.actions.dishonor(),
                        message: '{0} chooses to dishonor {1}'
                    }
                }
            }))
            .effect('honor or dishonor {0}');
    }
}
