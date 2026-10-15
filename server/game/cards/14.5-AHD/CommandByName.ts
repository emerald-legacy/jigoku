import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { setBaseProvinceStrength } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class CommandByName extends DrawCard {
    static id = 'command-by-name';

    setupCardAbilities() {
        this.action('Reduce province strength')
            .condition((context) => context.game.isDuringConflict())
            .cost(costs.payHonor(1))
            .cost(costs.discardCard({ location: Location.Hand }))
            .selectAttackedProvince({
                message: (context, cards) => msg`${context.player} reduces the strength of ${cards} to 0`,
                gameAction: cardLastingEffect(() => ({
                    effect: setBaseProvinceStrength(0)
                }))
            })
            .chatText('reduce the strength of an attacked province to 0');
    }
}


export default CommandByName;
