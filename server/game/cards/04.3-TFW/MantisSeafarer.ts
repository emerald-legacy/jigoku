import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class MantisSeafarer extends DrawCard {
    static id = 'mantis-seafarer';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain a fate',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            },
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.gainFate(),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}


export default MantisSeafarer;
