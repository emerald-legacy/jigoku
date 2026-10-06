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
                            message: '{0} chooses to honor {1}'
                        },
                        'Dishonor this character': {
                            action: dishonor(),
                            message: '{0} chooses to dishonor {1}'
                        }
                    }
                }),
                onAffinity(context => ({
                    trait: 'air',
                    gameAction: cardLastingEffect({
                        target: context.target,
                        effect: modifyGlory(2)
                    }),
                    effect: 'give {0} +2 glory',
                    effectArgs: () => [context.target]
                }))
            ]))
            .effect('honor or dishonor {0}');
    }
}
