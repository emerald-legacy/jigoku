import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';
import { CardType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class SilentSkirmisher extends DrawCard {
    static id = 'silent-skirmisher';

    override setupCardAbilities() {
        this.action('Sacrifice another for +2 military')
            .condition((context) => context.game.isDuringConflict())
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }))
            .cardLastingEffect({
                effect: modifyMilitarySkill(2)
            })
            .chatText(() => msg`give itself +2${'military'}`);
    }
}


export default SilentSkirmisher;

