import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class InDefenseOfRokugan extends DrawCard {
    static id = 'in-defense-of-rokugan';

    setupCardAbilities(ability) {
        this.action({
            title: 'Set an attacking character to 0 military skill',
            cost: ability.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.isDefending()
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.setMilitarySkill(0)
                })
            },
            effect: 'set {0}\'s {1} skill to 0',
            effectArgs: () => 'military'
        });
    }
}


export default InDefenseOfRokugan;
