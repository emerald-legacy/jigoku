import DrawCard from '../../drawcard.js';

class MantisSeafarer extends DrawCard {
    static id = 'mantis-seafarer';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a fate',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller
            },
            cost: ability.costs.payHonor(1),
            gameAction: ability.actions.gainFate(),
            limit: ability.limit.unlimitedPerConflict()
        });
    }
}


export default MantisSeafarer;
