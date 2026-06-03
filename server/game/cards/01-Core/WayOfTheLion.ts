import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheLion extends DrawCard {
    static id = 'way-of-the-lion';

    setupCardAbilities() {
        this.action({
            title: 'Double the base mil of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('lion') && card.getBaseMilitarySkill() > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2)
                })
            },
            effect: 'double the base {1} skill of {0}',
            effectArgs: () => 'military'
        });
    }
}


export default WayOfTheLion;
