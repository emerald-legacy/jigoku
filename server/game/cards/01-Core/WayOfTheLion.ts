import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { modifyBaseMilitarySkillMultiplier } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class WayOfTheLion extends DrawCard {
    static id = 'way-of-the-lion';

    override setupCardAbilities() {
        this.action('Double the base mil of a character')
            .condition((context) => context.game.isDuringConflict())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isFaction('lion') && card.getBaseMilitarySkill() > 0
            }, cardLastingEffect({
                effect: modifyBaseMilitarySkillMultiplier(2)
            }))
            .chatText((context) => msg`double the base ${'military'} skill of ${context.chatTarget()}`);
    }
}


export default WayOfTheLion;
