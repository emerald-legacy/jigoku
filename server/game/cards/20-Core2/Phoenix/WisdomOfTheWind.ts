import { msg } from '../../../GameChat.js';
import { CardType } from '../../../Constants.js';
import { modifyGlory } from '../../../effects.js';
import {
    cardLastingEffect,
    chooseAction,
    dishonor,
    honor,
    onAffinity,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class WisdomOfTheWind extends DrawCard {
    static id = 'wisdom-of-the-wind';

    setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .condition((context) => controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, sequential([
                chooseAction({
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
                }),
                onAffinity((context) => ({
                    trait: 'air',
                    gameAction: cardLastingEffect({
                        target: context.target,
                        effect: modifyGlory(2)
                    }),
                    chatText: 'give {0} +2 glory',
                    chatTextArgs: () => [context.target]
                }))
            ]))
            .chatText('honor or dishonor {0}');
    }
}
