import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class BlessedByFukurokujin extends DrawCard {
    static id = 'blessed-by-fukurokujin';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.cannotReceiveDishonorToken()
        });
    }
}


export default BlessedByFukurokujin;
