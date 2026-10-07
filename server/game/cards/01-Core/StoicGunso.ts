import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

class StoicGunso extends DrawCard {
    static id = 'stoic-gunso';

    setupCardAbilities() {
        this.action('Sacrifice a character for +3/+0')
            .cost(costs.sacrifice({ cardType: CardType.Character }))
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect({ effect: modifyMilitarySkill(3) })
            .effect(() => msg`give himself +3${'military'}/+0${'political'}`);
    }
}


export default StoicGunso;
