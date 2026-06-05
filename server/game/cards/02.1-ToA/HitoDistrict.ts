import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, ConflictType } from '../../Constants.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

class HitoDistrict extends DrawCard {
    static id = 'hito-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card: BaseCard, context?: AbilityContext) => card.isProvince && card.location === context?.source.location,
            effect: AbilityDsl.effects.cannotHaveConflictsDeclaredOfType(ConflictType.Political)
        });
    }
}


export default HitoDistrict;
