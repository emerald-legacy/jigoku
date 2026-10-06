import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { cancel } from '../../GameActions/GameActions.js';

class PathfindersBlade extends DrawCard {
    static id = 'pathfinder-s-blade';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isAttacking() && event.card.isConflictProvince()
            })
            .cost(AbilityDsl.costs.sacrificeSelf())
            .gameAction(cancel())
            .effect('cancel the effects of {1}\'s ability', context => context.event.card);
    }
}


export default PathfindersBlade;
