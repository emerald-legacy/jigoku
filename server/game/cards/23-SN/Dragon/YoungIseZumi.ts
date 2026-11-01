import { Duration } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { cannotDeclareRing } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class YoungIseZumi extends DrawCard {
    static id = 'young-ise-zumi';

    public override setupCardAbilities() {
        this.reaction('Prevent a ring from being used for a conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.isOnWinningSide(context.source)
            })
            .cost(costs.payFateToRing(1, () => true))
            .ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                // the target is checked before the cost is paid; any ring lets the ability be triggered
                target: context.costs.ringPaidFateTo || context.game.rings.air,
                effect: cannotDeclareRing(() => true)
            }))
            .chatText((context) => msg`prevent conflicts from being declared with the ${context.costs.ringPaidFateTo}`);
    }
}
