import { msg } from '../../../GameChat.js';
import { Duration } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { cannotDeclareRing } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class ReligiousConclave extends DrawCard {
    static id = 'religious-conclave';

    public setupCardAbilities() {
        this.action('Prevent an opponent contesting a ring')
            .condition((context) => context.player.opponent !== undefined)
            .cost(costs.sacrificeSelf())
            .ringTarget({
                ringCondition: () => true
            })
            .ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.ring.getElements().map((element) => context.game.rings[element]),
                effect: cannotDeclareRing((player) => player === context.player.opponent)
            }))
            .chatText((context) => msg`prevent ${context.player.opponent} from declaring a conflict with ${context.chatTarget()}`);
    }
}
