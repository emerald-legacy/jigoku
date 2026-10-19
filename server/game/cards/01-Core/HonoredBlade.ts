import DrawCard from '../../DrawCard.js';

class HonoredBlade extends DrawCard {
    static id = 'honored-blade';

    override setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter)
            })
            .gainHonor();
    }
}


export default HonoredBlade;
