import DrawCard from '../../DrawCard.js';

class HonoredBlade extends DrawCard {
    static id = 'honored-blade';

    setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                   event.conflict.winner === context.source.parentCharacter.controller
            })
            .gainHonor();
    }
}


export default HonoredBlade;
