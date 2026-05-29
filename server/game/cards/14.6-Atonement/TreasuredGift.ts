import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TreasuredGift extends DrawCard {
    static id = 'treasured-gift';

    setupCardAbilities() {
        this.attachmentConditions({
            opponentControlOnly: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
    }
}


export default TreasuredGift;

