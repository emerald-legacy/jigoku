import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaAmbusher extends DrawCard {
    static id = 'hiruma-ambusher';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Disable a character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.isDefending()
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.cardCannot('triggerAbilities')
                })
            },
            effect: 'prevent {0} from using any abilities'
        });
    }
}


export default HirumaAmbusher;
