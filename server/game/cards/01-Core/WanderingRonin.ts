import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class WanderingRonin extends DrawCard {
    static id = 'wandering-ronin';

    setupCardAbilities() {
        this.action('Give this character +2/+2')
            .cost(AbilityDsl.costs.removeFateFromSelf())
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect({ effect: modifyBothSkills(2) })
            .effect(() => msg`give himself +2${'military'}/+2${'political'}`)
            .limit(AbilityDsl.limit.perConflict(2));
    }
}


export default WanderingRonin;
