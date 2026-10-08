import { msg } from '../../GameChat.js';
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
                        message: (_context, target, player) => msg`${player} chooses to honor ${target}`
                    },
                    'Dishonor this character': {
                        action: dishonor(),
                        message: (_context, target, player) => msg`${player} chooses to dishonor ${target}`
                    }
                }
            }));
    }
}
