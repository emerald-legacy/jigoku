import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, ConflictType } from '../../Constants.js';

class ChiseiDistrict extends DrawCard {
    static id = 'chisei-district';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            match: (card: DrawCard, context) => card.isProvince && card.location === (context as AbilityContext).source.location,
            effect: AbilityDsl.effects.cannotHaveConflictsDeclaredOfType(ConflictType.Military)
        });
    }
}


export default ChiseiDistrict;
