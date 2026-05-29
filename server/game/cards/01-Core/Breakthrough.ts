import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class Breakthrough extends DrawCard {
    static id = 'breakthrough';

    setupCardAbilities() {
        this.reaction({
            title: 'Declare a new conflict',
            when: {
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player && event.conflict.winner === context.player &&
                    this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length === 1 &&
                    event.conflict.getConflictProvinces().some(a => a.isBroken)
            },
            gameAction: AbilityDsl.actions.initiateConflict({ canPass: false })
        });
    }
}


export default Breakthrough;
