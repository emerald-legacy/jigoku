import DrawCard from '../../DrawCard.js';
import { increaseLimitOnAbilities, modifyProvinceStrengthBonus } from '../../effects.js';
import { CardType, Location, Players } from '../../Constants.js';

class MidnightBuilder extends DrawCard {
    static id = 'midnight-builder';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: card => card.type === CardType.Holding,
            effect: modifyProvinceStrengthBonus(2)
        });

        this.dire({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: card => card.type === CardType.Holding,
            effect: increaseLimitOnAbilities()
        });
    }
}


export default MidnightBuilder;
