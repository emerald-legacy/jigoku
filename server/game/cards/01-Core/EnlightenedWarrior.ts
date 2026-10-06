import DrawCard from '../../DrawCard.js';
import { placeFate } from '../../GameActions/GameActions.js';

class EnlightenedWarrior extends DrawCard {
    static id = 'enlightened-warrior';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onConflictDeclared: (event, context) => (event.ringFate ?? 0) > 0 && event.conflict.attackingPlayer === context.player.opponent
            })
            .gameAction(placeFate());
    }
}


export default EnlightenedWarrior;
