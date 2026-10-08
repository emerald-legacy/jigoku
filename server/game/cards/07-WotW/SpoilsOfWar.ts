import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { chosenDiscard, draw, sequential } from '../../GameActions/GameActions.js';
import { ConflictType } from '../../Constants.js';

class SpoilsOfWar extends DrawCard {
    static id = 'spoils-of-war';

    setupCardAbilities() {
        this.reaction('Draw 3 cards and discard 1')
            .when({
                afterConflict: (event, context) => event.conflict.conflictType === ConflictType.Military &&
                                                   event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            })
            .gameAction(sequential([
                draw(context => ({ target: context.player, amount: 3 })),
                chosenDiscard(context => ({ target: context.player }))
            ]))
            .chatText('draw 3 cards, then discard 1')
            .max(perConflict(1));
    }
}


export default SpoilsOfWar;
