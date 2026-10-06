import { CardType } from '../../Constants.js';
import { chooseAction, dishonor, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AsakoDiplomat extends DrawCard {
    static id = 'asako-diplomat';

    setupCardAbilities() {
        this.reaction('Honor or dishonor a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardType.Character
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
            }));
    }
}
