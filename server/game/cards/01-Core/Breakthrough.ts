import DrawCard from '../../DrawCard.js';
import { initiateConflict } from '../../GameActions/GameActions.js';

class Breakthrough extends DrawCard {
    static id = 'breakthrough';

    setupCardAbilities() {
        this.reaction('Declare a new conflict')
            .when({
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player && event.conflict.winner === context.player &&
                    this.game.getConflicts(context.player).filter((conflict) => !conflict.passed).length === 1 &&
                    event.conflict.getConflictProvinces().some((a) => a.isBroken)
            })
            .gameAction(initiateConflict({ canPass: false }));
    }
}


export default Breakthrough;
