import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class OpenFieldSkirmisher extends DrawCard {
    static id = 'open-field-skirmisher';

    setupCardAbilities() {
        this.action('Reduce Province Strength')
            .cost(costs.removeFateFromSelf())
            .condition((context) => context.source.isAttacking())
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 3`,
                gameAction: cardLastingEffect(() => ({
                    effect: modifyProvinceStrength(-3)
                }))
            })
            .chatText('reduce the strength of an attacked province by 3');
    }
}


export default OpenFieldSkirmisher;
