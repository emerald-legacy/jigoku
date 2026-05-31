import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

class LiquidCourage extends DrawCard {
    static id = 'liquid-courage';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.addKeyword('pride')
        });

        this.whileAttached({
            effect: [
                AbilityDsl.effects.mustBeDeclaredAsAttackerIfType('military'),
                AbilityDsl.effects.mustBeDeclaredAsDefender('military')
            ]
        });
    }
}

export default LiquidCourage;
