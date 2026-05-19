import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class LionsPrideBrawler extends DrawCard {
    static id = 'lion-s-pride-brawler';

    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: ability.actions.bow()
            }
        });
    }
}


export default LionsPrideBrawler;
