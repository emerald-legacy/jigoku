import { ConflictType } from '../../Constants.js';
import { cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type { PlayType } from '../../Constants.js';

class StolenBreath extends DrawCard {
    static id = 'stolen-breath';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                cannotParticipateAsAttacker(ConflictType.Political),
                cannotParticipateAsDefender(ConflictType.Political)
            ]
        });
    }

    canPlay(context: AbilityContext, playType?: PlayType) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default StolenBreath;
