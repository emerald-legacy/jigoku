import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class StaunchHida extends DrawCard {
    static id = 'staunch-hida';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Resolve the ring effect',
            max: ability.limit.perConflict(1),
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isDefending()
            },
            gameAction: ability.actions.resolveConflictRing()
        });
    }
}


export default StaunchHida;
