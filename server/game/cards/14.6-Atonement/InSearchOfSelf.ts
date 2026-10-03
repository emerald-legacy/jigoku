import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class InSearchOfSelf extends DrawCard {
    static id = 'in-search-of-self';

    setupCardAbilities() {
        this.action('Bow attacking character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.costLessThan(context.player.getNumberOfFacedownProvinces() + 1)
            }, AbilityDsl.actions.bow());
    }
}


export default InSearchOfSelf;
