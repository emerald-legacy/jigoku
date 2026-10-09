import DrawCard from '../../DrawCard.js';
import { Location, RestrictionType } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class DoomedShugenja extends DrawCard {
    static id = 'doomed-shugenja';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: playerCannot({
                cannot: RestrictionType.PlaceFateWhenPlayingCharacterFromProvince,
                restricts: 'source'
            })
        });
    }
}


export default DoomedShugenja;
