import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            }, AbilityDsl.actions.sequential([
                AbilityDsl.actions.chooseAction({
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
                }),
                AbilityDsl.actions.onAffinity(context => ({
                    trait: 'air',
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        target: context.target,
                        effect: AbilityDsl.effects.modifyGlory(2)
                    }),
                    effect: 'give {0} +2 glory',
                    effectArgs: () => [context.target]
                }))
            ]))
            .effect('honor or dishonor {0}');
    }
}
