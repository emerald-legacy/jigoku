import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, ConflictType } from '../../Constants.js';

class HitoDistrict extends DrawCard {
    static id = 'hito-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card: any, context: any) => card.isProvince && card.location === context.source.location,
            effect: AbilityDsl.effects.cannotHaveConflictsDeclaredOfType(ConflictType.Political)
        });
    }
}


export default HitoDistrict;
