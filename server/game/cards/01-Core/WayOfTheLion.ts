import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WayOfTheLion extends DrawCard {
    static id = 'way-of-the-lion';

    setupCardAbilities() {
        this.action('Double the base mil of a character')
            .condition(() => this.game.isDuringConflict())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => card.isFaction('lion') && card.getBaseMilitarySkill() > 0
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2)
            }))
            .effect('double the base {1} skill of {0}', () => 'military');
    }
}


export default WayOfTheLion;
