import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';

class ShibaPeacemaker extends DrawCard {
    static id = 'shiba-peacemaker';

    setupCardAbilities(ability) {
        this.persistentEffect({
            location: Locations.Any,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default ShibaPeacemaker;
