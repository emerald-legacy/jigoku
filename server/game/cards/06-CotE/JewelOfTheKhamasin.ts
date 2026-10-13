import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { unlimited } from '../../AbilityLimit.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class JewelOfTheKhamasin extends DrawCard {
    static id = 'jewel-of-the-khamasin';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isAttacking()))
            .cost(costs.payHonor(1))
            .selectAttackedProvince({
                cardCondition: (card) => card.getStrength() > 0,
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} by 1`,
                gameAction: cardLastingEffect(() => ({
                    effect: modifyProvinceStrength(-1)
                }))
            })
            .chatText('reduce an attacked province strength by 1')
            .limit(unlimited());
    }
}


export default JewelOfTheKhamasin;
