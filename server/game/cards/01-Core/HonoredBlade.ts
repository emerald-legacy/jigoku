import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class HonoredBlade extends DrawCard {
    static id = 'honored-blade';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.attachedCharacter && context.source.attachedCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.attachedCharacter.controller
            },
            gameAction: AbilityDsl.actions.gainHonor()
        });
    }
}


export default HonoredBlade;
