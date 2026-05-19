import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class HirumaAmbusher extends DrawCard {
    static id = 'hiruma-ambusher';

    setupCardAbilities(ability) {
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
