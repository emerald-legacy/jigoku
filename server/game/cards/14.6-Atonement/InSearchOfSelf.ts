import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class InSearchOfSelf extends DrawCard {
    static id = 'in-search-of-self';

    setupCardAbilities() {
        this.action('Bow attacking character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.costLessThan(context.player.getNumberOfFacedownProvinces() + 1)
            }, bow());
    }
}


export default InSearchOfSelf;
