import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class WanderingRonin extends DrawCard {
    static id = 'wandering-ronin';

    setupCardAbilities() {
        this.action('Give this character +2/+2')
            .cost(costs.removeFateFromSelf())
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .effect(() => msg`give himself +2${'military'}/+2${'political'}`)
            .limit(perConflict(2));
    }
}


export default WanderingRonin;
