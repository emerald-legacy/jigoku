import DrawCard from '../../DrawCard.js';

class Breakthrough extends DrawCard {
    static id = 'breakthrough';

    override setupCardAbilities() {
        this.reaction('Declare a new conflict')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player && event.conflict.winner === context.player &&
                    this.game.getDeclaredConflictCount(context.player) === 1 &&
                    event.conflict.getConflictProvinces().some((a) => a.isBroken)
            })
            .initiateConflict({ canPass: false });
    }
}


export default Breakthrough;
