import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isDefending())
            .gameAction(resolveConflictRing())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default GuardianKami;
