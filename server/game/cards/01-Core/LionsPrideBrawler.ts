import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { bow } from '../../GameActions/GameActions.js';

class LionsPrideBrawler extends DrawCard {
    static id = 'lion-s-pride-brawler';

    setupCardAbilities() {
        this.action('Bow a character')
            .condition(context => context.source.isAttacking())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.militarySkill <= context.source.militarySkill
            }, bow());
    }
}


export default LionsPrideBrawler;
