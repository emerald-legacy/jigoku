import DrawCard from '../../DrawCard.js';
import { Location, RestrictionType, RestrictionScope } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class DoomedShugenja extends DrawCard {
    static id = 'doomed-shugenja';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            effect: playerCannot({
                cannot: RestrictionType.PlaceFateWhenPlayingCharacterFromProvince,
                appliesTo: RestrictionScope.Source
            })
        });
    }
}


export default DoomedShugenja;
