import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';

class StaunchHida extends DrawCard {
    static id = 'staunch-hida';

    override setupCardAbilities() {
        this.reaction('Resolve the ring effect')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            })
            .resolveConflictRing()
            .max(perConflict(1));
    }
}


export default StaunchHida;
