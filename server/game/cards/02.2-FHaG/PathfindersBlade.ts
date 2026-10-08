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
            .chatText('cancel the effects of {1}\'s ability', (context) => context.event.card);
    }
}


export default PathfindersBlade;
