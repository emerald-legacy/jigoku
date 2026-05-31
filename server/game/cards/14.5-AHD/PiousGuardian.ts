import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PiousGuardian extends DrawCard {
    static id = 'pious-guardian';

    setupCardAbilities() {
        this.interrupt({
            title: 'Gain 1 honor',
            when : {
                onPhaseEnded: (event, context) => event.phase === Phases.Conflict && context.player.getProvinces(a => a.isBroken).length < 2
            },
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player
            }))
        });
    }
}


export default PiousGuardian;
