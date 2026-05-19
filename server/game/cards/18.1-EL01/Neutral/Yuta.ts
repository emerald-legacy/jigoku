import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';

class Yuta extends DrawCard {
    static id = 'yuta';

    setupCardAbilities() {
        this.reaction({
            title: 'Steal a fate',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isAttacking()
            },
            gameAction: AbilityDsl.actions.takeFate()
        });
    }
}

export default Yuta;
