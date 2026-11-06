import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    override setupCardAbilities() {
        this.action('Resolve ring effect')
            .condition((context) => context.source.isDefending())
            .cost(costs.sacrificeSelf())
            .resolveConflictRing()
            .max(perConflict(1));
    }
}


export default GuardianKami;
