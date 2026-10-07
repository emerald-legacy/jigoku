import DrawCard from '../../DrawCard.js';
import { CardType, ConflictType } from '../../Constants.js';
import { perConflict } from '../../AbilityLimit.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class FallenInBattle extends DrawCard {
    static id = 'fallen-in-battle';

    setupCardAbilities() {
        this.reaction('Discard a character')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.conflictType === ConflictType.Military &&
                                                   (event.conflict.skillDifference ?? 0) >= 5
            })
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, discardFromPlay())
            .max(perConflict(1));
    }
}


export default FallenInBattle;
