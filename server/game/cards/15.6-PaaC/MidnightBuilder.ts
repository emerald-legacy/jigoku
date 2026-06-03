import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location, Players } from '../../Constants.js';

class MidnightBuilder extends DrawCard {
    static id = 'midnight-builder';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: card => card.type === CardType.Holding,
            effect: AbilityDsl.effects.modifyProvinceStrengthBonus(2)
        });

        this.dire({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: card => card.type === CardType.Holding,
            effect: AbilityDsl.effects.increaseLimitOnAbilities()
        });
    }
}


export default MidnightBuilder;
