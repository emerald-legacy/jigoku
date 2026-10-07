import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class OniMask extends DrawCard {
    static id = 'oni-mask';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.action('Blank participating character')
            .cost(costs.removeFateFromParent())
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, cardLastingEffect({ effect: blank() }))
            .effect('blank {0} until the end of the conflict');
    }
}


export default OniMask;
