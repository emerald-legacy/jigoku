import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { ConflictType } from '../../Constants.js';

class SpoilsOfWar extends DrawCard {
    static id = 'spoils-of-war';

    override setupCardAbilities() {
        this.reaction('Draw 3 cards and discard 1')
            .when({
                afterConflict: (event, context) => event.conflict.conflictType === ConflictType.Military &&
                                                   event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            })
            .draw(3)
            .chatText('draw 3 cards, then discard 1')
            .max(perConflict(1))
            .then()
            .chosenDiscard((context) => ({ target: context.player }));
    }
}


export default SpoilsOfWar;
