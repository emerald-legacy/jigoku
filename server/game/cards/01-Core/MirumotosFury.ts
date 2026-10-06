import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class MirumotosFury extends DrawCard {
    static id = 'mirumoto-s-fury';

    setupCardAbilities() {
        this.action('Bow attacking character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getGlory() <= this.game.provinceCards.filter(card => (
                    card.isFacedown() && card.controller === context.player
                )).length
            }, bow());
    }
}


export default MirumotosFury;
