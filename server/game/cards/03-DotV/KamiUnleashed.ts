import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { perConflict } from '../../AbilityLimit.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(costs.sacrificeSelf())
            .condition(context => context.source.isAttacking())
            .gameAction(resolveConflictRing())
            .max(perConflict(1));
    }
}


export default KamiUnleashed;
