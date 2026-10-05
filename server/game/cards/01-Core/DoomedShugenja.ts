import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DoomedShugenja extends DrawCard {
    static id = 'doomed-shugenja';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'source'
            })
        });
    }
}


export default DoomedShugenja;
