import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class KamiUnleashed extends DrawCard {
    static id = 'kami-unleashed';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Resolve ring effect',
            cost: ability.costs.sacrificeSelf(),
            max: ability.limit.perConflict(1),
            condition: context => context.source.isAttacking(),
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default KamiUnleashed;
