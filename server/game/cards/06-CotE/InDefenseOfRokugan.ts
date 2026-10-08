import * as costs from '../../costs/index.js';
import { setMilitarySkill } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class InDefenseOfRokugan extends DrawCard {
    static id = 'in-defense-of-rokugan';

    setupCardAbilities() {
        this.action('Set an attacking character to 0 military skill')
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDefending()
            }))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, cardLastingEffect({
                effect: setMilitarySkill(0)
            }))
            .chatText('set {0}\'s {1} skill to 0', () => 'military');
    }
}


export default InDefenseOfRokugan;
