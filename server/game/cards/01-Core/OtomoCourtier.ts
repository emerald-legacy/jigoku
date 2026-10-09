import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { cannotParticipateAsAttacker } from '../../effects.js';

class OtomoCourtier extends DrawCard {
    static id = 'otomo-courtier';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            condition: (context) => !!context.player.opponent && context.player.opponent.imperialFavor !== '',
            effect: cannotParticipateAsAttacker()
        });
    }
}


export default OtomoCourtier;
