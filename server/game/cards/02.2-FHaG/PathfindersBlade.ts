import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';

class PathfindersBlade extends DrawCard {
    static id = 'pathfinder-s-blade';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isAttacking() && event.card.isConflictProvince()
            })
            .cost(costs.sacrificeSelf())
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`);
    }
}


export default PathfindersBlade;
