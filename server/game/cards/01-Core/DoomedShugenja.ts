import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class DoomedShugenja extends DrawCard {
    static id = 'doomed-shugenja';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'source'
            })
        });
    }
}


export default DoomedShugenja;
