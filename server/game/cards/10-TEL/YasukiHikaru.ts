import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes } from '../../Constants';

class YasukiHikaru extends DrawCard {
    static id = 'yasuki-hikaru';

    setupCardAbilities() {
        this.action({
            title: 'Send home character',
            condition: (context) => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isAttacking() && card.getMilitarySkill() > context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}


export default YasukiHikaru;
