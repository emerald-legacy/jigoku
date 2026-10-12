import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { setBaseProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class RideThemDown extends DrawCard {
    static id = 'ride-them-down';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .cost(costs.discardImperialFavor())
            .condition(() => this.game.isDuringConflict())
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} to 1`,
                gameAction: cardLastingEffect({
                    effect: setBaseProvinceStrength(1)
                })
            })
            .chatText('reduce the strength of an attacked province to 1');
    }
}


export default RideThemDown;
