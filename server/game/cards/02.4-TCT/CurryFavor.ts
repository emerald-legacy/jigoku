import { ready } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class CurryFavor extends DrawCard {
    static id = 'curry-favor';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onReturnHome: (event, context) => {
                    if(this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length !== 2) {
                        return false;
                    }
                    return event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !event.bowEvent.cancelled;
                }
            })
            .gameAction(ready((context) => ({ target: context.event.card })))
            .cannotBeMirrored();
    }
}


export default CurryFavor;
