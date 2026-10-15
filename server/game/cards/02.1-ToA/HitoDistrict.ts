import DrawCard from '../../DrawCard.js';
import { cannotHaveConflictsDeclaredOfType } from '../../effects.js';
import { Location, ConflictType } from '../../Constants.js';

class HitoDistrict extends DrawCard {
    static id = 'hito-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card, context) => !!context && card.isProvince && card.location === context.source.location,
            effect: cannotHaveConflictsDeclaredOfType(ConflictType.Political)
        });
    }
}


export default HitoDistrict;
