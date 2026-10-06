import { cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../effects.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

class StolenBreath extends DrawCard {
    static id = 'stolen-breath';

    setupCardAbilities() {
        this.whileAttached({
            effect: [
                cannotParticipateAsAttacker('political'),
                cannotParticipateAsDefender('political')
            ]
        });
    }

    canPlay(context: AbilityContext, playType: string) {
        if(this.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default StolenBreath;
