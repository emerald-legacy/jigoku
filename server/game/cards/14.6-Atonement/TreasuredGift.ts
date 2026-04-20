import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';

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

