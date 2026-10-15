import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class WanderingRonin extends DrawCard {
    static id = 'wandering-ronin';

    override setupCardAbilities() {
        this.action('Give this character +2/+2')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.removeFateFromSelf())
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .chatText(() => msg`give himself +2${'military'}/+2${'political'}`)
            .limit(perConflict(2));
    }
}


export default WanderingRonin;
