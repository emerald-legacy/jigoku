import DrawCard from '../../DrawCard.js';

class Breakthrough extends DrawCard {
    static id = 'breakthrough';

    override setupCardAbilities() {
        this.reaction('Declare a new conflict')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.getConflictProvinces().some((a) => a.isBroken)
            })
            // "your second conflict": a copy (The Mirror's Gaze) needs it too (developer ruling)
            .condition((context) => this.game.getDeclaredConflictCount(context.player) === 1)
            .initiateConflict({ canPass: false });
    }
}


export default Breakthrough;
