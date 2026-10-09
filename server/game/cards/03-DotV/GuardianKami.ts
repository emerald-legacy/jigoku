import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(costs.sacrificeSelf())
            .condition((context) => context.source.isDefending())
            .gameAction(resolveConflictRing())
            .max(perConflict(1));
    }
}


export default GuardianKami;
