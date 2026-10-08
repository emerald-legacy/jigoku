import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class SinisterSoshi extends DrawCard {
    static id = 'sinister-soshi';

    setupCardAbilities() {
        this.action('Give a character -2/-2')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect({ effect: modifyBothSkills(-2) }))
            .chatText((context) => msg`give ${context.chatTarget()} -2${'military'}/-2${'political'}`);
    }
}


export default SinisterSoshi;
