import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(costs.sacrificeSelf())
            .condition((context) => context.source.isAttacking())
            .resolveConflictRing()
            .max(perConflict(1));
    }
}


export default KamiUnleashed;
