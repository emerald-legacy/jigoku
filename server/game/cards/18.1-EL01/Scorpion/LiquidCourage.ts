import DrawCard from '../../../DrawCard.js';
import { addKeyword, mustBeDeclaredAsAttackerIfType, mustBeDeclaredAsDefender } from '../../../effects.js';
import { ConflictType } from '../../../Constants.js';

class LiquidCourage extends DrawCard {
    static id = 'liquid-courage';

    setupCardAbilities() {
        this.whileAttached({
            effect: addKeyword('pride')
        });

        this.whileAttached({
            effect: [
                mustBeDeclaredAsAttackerIfType(ConflictType.Military),
                mustBeDeclaredAsDefender(ConflictType.Military)
            ]
        });
    }
}

export default LiquidCourage;
