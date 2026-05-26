import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, ConflictTypes } from '../../Constants.js';

class HitoDistrict extends DrawCard {
    static id = 'hito-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card: any, context: any) => card.isProvince && card.location === context.source.location,
            effect: AbilityDsl.effects.cannotHaveConflictsDeclaredOfType(ConflictTypes.Political)
        });
    }
}


export default HitoDistrict;
