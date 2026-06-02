import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class InDefenseOfRokugan extends DrawCard {
    static id = 'in-defense-of-rokugan';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Set an attacking character to 0 military skill',
            cost: ability.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isDefending()
            }),
            target: {
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isAttacking(),
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
