import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class LionsPrideBrawler extends DrawCard {
    static id = 'lion-s-pride-brawler';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: ability.actions.bow()
            }
        });
    }
}


export default LionsPrideBrawler;
