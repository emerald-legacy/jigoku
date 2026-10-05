import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ConflictType } from '../../../Constants.js';

class LiquidCourage extends DrawCard {
    static id = 'liquid-courage';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('pride')
        });

        this.whileAttached({
            effect: [
                AbilityDsl.effects.mustBeDeclaredAsAttackerIfType(ConflictType.Military),
                AbilityDsl.effects.mustBeDeclaredAsDefender(ConflictType.Military)
            ]
        });
    }
}

export default LiquidCourage;
