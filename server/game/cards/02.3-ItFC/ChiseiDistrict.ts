import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, ConflictTypes } from '../../Constants.js';

class ChiseiDistrict extends DrawCard {
    static id = 'chisei-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            match: (card, context) => card.isProvince && card.location === context.source.location,
            effect: AbilityDsl.effects.cannotHaveConflictsDeclaredOfType(ConflictTypes.Military)
        });
    }
}


export default ChiseiDistrict;
