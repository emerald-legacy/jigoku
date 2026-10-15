import { msg } from '../../../GameChat.js';
import { CardType, Trait } from '../../../Constants.js';
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

    override setupCardAbilities() {
        this.action('Honor or dishonor a character')
            .condition((context) => controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, sequential([
                chooseAction({
                    choices: {
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
                    trait: Trait.Air,
                    gameAction: cardLastingEffect({
                        target: context.target,
                        effect: modifyGlory(2)
                    }),
                    chatText: () => msg`give ${context.target} +2 glory`
                }))
            ]))
            .chatText('honor or dishonor {0}');
    }
}
