import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class StoicGunso extends DrawCard {
    static id = 'stoic-gunso';

    override setupCardAbilities() {
        this.action('Sacrifice a character for +3/+0')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .cardLastingEffect({ effect: modifyMilitarySkill(3) })
            .chatText(() => msg`give himself +3${'military'}/+0${'political'}`);
    }
}


export default StoicGunso;
