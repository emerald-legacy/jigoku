import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { cannotParticipateAsAttacker } from '../../effects.js';

class ShibaPeacemaker extends DrawCard {
    static id = 'shiba-peacemaker';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: cannotParticipateAsAttacker()
        });
    }
}


export default ShibaPeacemaker;
