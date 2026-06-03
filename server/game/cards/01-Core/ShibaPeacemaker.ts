import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShibaPeacemaker extends DrawCard {
    static id = 'shiba-peacemaker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Location.Any,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default ShibaPeacemaker;
