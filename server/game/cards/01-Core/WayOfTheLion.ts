import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyBaseMilitarySkillMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class WayOfTheLion extends DrawCard {
    static id = 'way-of-the-lion';

    setupCardAbilities() {
        this.conflictAction('Double the base mil of a character')
            .target({
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('lion') && card.getBaseMilitarySkill() > 0
            }, cardLastingEffect({
                effect: modifyBaseMilitarySkillMultiplier(2)
            }))
            .chatText('double the base {1} skill of {0}', () => 'military');
    }
}


export default WayOfTheLion;
