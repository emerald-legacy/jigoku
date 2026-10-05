import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities() {
        this.action('Resolve ring effect')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .condition(context => context.source.isAttacking())
            .gameAction(AbilityDsl.actions.resolveConflictRing())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default KamiUnleashed;
