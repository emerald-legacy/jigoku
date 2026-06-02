import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class YasukiHikaru extends DrawCard {
    static id = 'yasuki-hikaru';

    setupCardAbilities() {
        this.action({
            title: 'Send home character',
            condition: (context) => context.source.isDefending(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getMilitarySkill() > context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}


export default YasukiHikaru;
