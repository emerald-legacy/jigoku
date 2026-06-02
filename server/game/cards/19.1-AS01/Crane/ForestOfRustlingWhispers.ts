import { CardType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ForestOfRustlingWhispers extends ProvinceCard {
    static id = 'forest-of-rustling-whispers';

    public setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            effect: 'honor or dishonor {0}',
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.chooseAction({
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
                })
            }
        });
    }
}
