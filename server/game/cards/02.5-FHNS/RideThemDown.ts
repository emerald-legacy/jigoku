import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { setBaseProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class RideThemDown extends DrawCard {
    static id = 'ride-them-down';

    override setupCardAbilities() {
        this.action('Reduce province strength')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.discardImperialFavor())
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
