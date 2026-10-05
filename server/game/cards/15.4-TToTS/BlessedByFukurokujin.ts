import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class BlessedByFukurokujin extends DrawCard {
    static id = 'blessed-by-fukurokujin';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cannotReceiveDishonorToken()
        });
    }
}


export default BlessedByFukurokujin;
