import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class HonoredBlade extends DrawCard {
    static id = 'honored-blade';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                                                   event.conflict.winner === context.source.parent.controller
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}


export default HonoredBlade;
