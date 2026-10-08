import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class ShiroNishiyama extends StrongholdCard {
    static id = 'shiro-nishiyama';

    setupCardAbilities() {
        this.action('Give defending characters +1/+1')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict())
            .cardLastingEffect((context) => ({
                target: context.player.cardsInPlay.filter((card) => card.isDefending()),
                effect: modifyBothSkills(1)
            }))
            .chatText(() => msg`add +1${'military'}/+1${'political'} to all defenders they control`);
    }
}
