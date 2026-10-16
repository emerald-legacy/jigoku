import { msg } from '../../../GameChat.js';
import { CardType, Trait } from '../../../Constants.js';
import { modifyGlory } from '../../../effects.js';
import { cardLastingEffect, dishonor, honor, onAffinity } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { controlsShugenja } from '../../controlsShugenja.js';

export default class WisdomOfTheWind extends DrawCard {
    static id = 'wisdom-of-the-wind';

    override setupCardAbilities() {
        this.conflictAction('Honor or dishonor a character')
            .condition((context) => controlsShugenja(context.player))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            })
            .select({
                name: 'select',
                dependsOn: 'target'
            }, {
                'Honor this character': {
                    action: honor((context) => ({ target: context.target })),
                    chatText: 'honor {0}'
                },
                'Dishonor this character': {
                    action: dishonor((context) => ({ target: context.target })),
                    chatText: 'dishonor {0}'
                }
            })
            .gameAction(onAffinity((context) => ({
                trait: Trait.Air,
                gameAction: cardLastingEffect({
                    target: context.target,
                    effect: modifyGlory(2)
                }),
                chatText: () => msg`give ${context.target} +2 glory`
            })));
    }
}
