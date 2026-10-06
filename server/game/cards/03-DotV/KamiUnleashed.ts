import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isAttacking())
            .gameAction(resolveConflictRing())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default KamiUnleashed;
