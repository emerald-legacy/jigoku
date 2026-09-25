import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Resolve ring effect')
            .cost(ability.costs.sacrificeSelf())
            .condition(context => context.source.isAttacking())
            .gameAction(ability.actions.resolveConflictRing())
            .max(ability.limit.perConflict(1));
    }
}


export default KamiUnleashed;
