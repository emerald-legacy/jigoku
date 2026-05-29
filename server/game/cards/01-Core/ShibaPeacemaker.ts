import DrawCard from '../../DrawCard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShibaPeacemaker extends DrawCard {
    static id = 'shiba-peacemaker';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Locations.Any,
            effect: ability.effects.cannotParticipateAsAttacker()
        });
    }
}


export default ShibaPeacemaker;
