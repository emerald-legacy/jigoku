import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isDefending())
            .gameAction(AbilityDsl.actions.resolveConflictRing())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default GuardianKami;
