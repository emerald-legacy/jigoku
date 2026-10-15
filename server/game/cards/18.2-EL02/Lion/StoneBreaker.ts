import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import * as costs from '../../../costs/index.js';
import { modifyProvinceStrength } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    override setupCardAbilities() {
        moveCardInProvinceAction(this)
            .cost(costs.sacrificeSelf())
            .refillFaceup((context) => ({ location: context.cardStateWhenInitiated?.location ?? [] }));

        this.conflictAction('Reduce province strength')
            .selectAttackedProvince({
                cardCondition: (card) => card.getStrength() > 0,
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 2`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength(-2)
                })
            })
            .chatText('reduce an attacked province strength by 2');
    }
}


export default StoneBreaker;
