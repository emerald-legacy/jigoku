import DrawCard from '../../DrawCard.js';
import { cannotBeDeclaredAsAttacker } from '../../effects.js';

class TreasuredGift extends DrawCard {
    static id = 'treasured-gift';

    setupCardAbilities() {
        this.attachmentConditions({
            opponentControlOnly: true
        });

        this.whileAttached({
            effect: cannotBeDeclaredAsAttacker()
        });
    }
}


export default TreasuredGift;

