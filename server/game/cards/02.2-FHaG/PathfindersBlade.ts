import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class PathfindersBlade extends DrawCard {
    static id = 'pathfinder-s-blade';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) => context.source.parent && context.source.parent.isAttacking() && event.card.isConflictProvince()
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default PathfindersBlade;
