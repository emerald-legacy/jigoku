import DrawCard from '../../DrawCard.js';
import { sendHome } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class YasukiHikaru extends DrawCard {
    static id = 'yasuki-hikaru';

    setupCardAbilities() {
        this.action('Send home character')
            .condition((context) => context.source.isDefending())
            .target({
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getMilitarySkill() > context.source.getMilitarySkill()
            }, sendHome());
    }
}


export default YasukiHikaru;
