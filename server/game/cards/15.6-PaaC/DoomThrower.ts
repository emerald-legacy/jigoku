import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class DoomThrower extends DrawCard {
    static id = 'doom-thrower';

    setupCardAbilities() {
        this.action('Reduce Province Strength')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .condition((context) => context.game.isDuringConflict())
            .selectAttackedProvince((context) => ({
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards}`,
                gameAction: cardLastingEffect({
                    effect: modifyProvinceStrength((context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.getFate() > 0) ? -5 : -2)
                })
            }))
            .chatText((context) => msg`reduce an attacked province's strength by ${(context.costs.sacrificeStateWhenChosen && context.costs.sacrificeStateWhenChosen.getFate() > 0) ? 5 : 2}`);
    }
}


export default DoomThrower;
