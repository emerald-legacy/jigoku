import { Duration } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { cannotDeclareRing } from '../../../effects.js';
import { ringLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class YoungIseZumi extends DrawCard {
    static id = 'young-ise-zumi';

    public setupCardAbilities() {
        this.reaction('Prevent a ring from being used for a conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .cost(costs.payFateToRing(1, () => true))
            .gameAction(ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.costs.ringPaidFateTo || context.game.rings.air,
                effect: cannotDeclareRing(() => true)
            })))
            .effect((context) => msg`prevent conflicts from being declared with the ${context.costs.ringPaidFateTo}`);
    }
}
