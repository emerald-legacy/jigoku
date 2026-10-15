import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { modifyMilitarySkill } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class YojinNoShiro extends StrongholdCard {
    static id = 'yojin-no-shiro';

    override setupCardAbilities() {
        this.action('Give attacking characters +1/+0')
            .condition(() => this.game.isDuringConflict())
            .cost(costs.bowSelf())
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.isAttacking()),
                effect: modifyMilitarySkill(1)
            }))
            .chatText(() => msg`give attacking characters +1${'military'}/+0${'political'}`);
    }
}
