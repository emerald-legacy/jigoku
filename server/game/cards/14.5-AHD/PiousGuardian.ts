import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';

class PiousGuardian extends DrawCard {
    static id = 'pious-guardian';

    setupCardAbilities() {
        this.interrupt('Gain 1 honor')
            .when({
                onPhaseEnded: (event, context) => event.phase === Phase.Conflict && context.player.getProvinces((a) => a.isBroken).length < 2
            })
            .gainHonor();
    }
}


export default PiousGuardian;
