import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class StaunchHida extends DrawCard {
    static id = 'staunch-hida';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .gameAction(ability.actions.resolveConflictRing())
            .max(ability.limit.perConflict(1));
    }
}


export default StaunchHida;
