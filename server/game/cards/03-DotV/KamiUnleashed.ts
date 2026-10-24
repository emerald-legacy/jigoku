import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    override setupCardAbilities() {
        this.action('Resolve ring effect')
            .condition((context) => context.source.isAttacking())
            .cost(costs.sacrificeSelf())
            .resolveConflictRing()
            .max(perConflict(1));
    }
}


export default KamiUnleashed;
