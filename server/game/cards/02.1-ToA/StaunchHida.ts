import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { resolveConflictRing } from '../../GameActions/GameActions.js';

class StaunchHida extends DrawCard {
    static id = 'staunch-hida';

    setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .gameAction(resolveConflictRing())
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default StaunchHida;
