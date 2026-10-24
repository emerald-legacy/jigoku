import DrawCard from '../../DrawCard.js';

class Breakthrough extends DrawCard {
    static id = 'breakthrough';

    override setupCardAbilities() {
        this.reaction('Declare a new conflict')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.provincesAtEnd.some((province) => province.isBroken)
            })
            // "your second conflict": exactly one conflict declared or passed so far, also for a copy (The Mirror's Gaze)
            .condition((context) => context.game.getConflicts(context.player).length === 1)
            .initiateConflict({ canPass: false });
    }
}


export default Breakthrough;
