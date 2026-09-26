import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class GuardianKami extends DrawCard {
    static id = 'guardian-kami';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Resolve ring effect')
            .cost(ability.costs.sacrificeSelf())
            .condition(context => context.source.isDefending())
            .gameAction(ability.actions.resolveConflictRing())
            .max(ability.limit.perConflict(1));
    }
}


export default GuardianKami;
