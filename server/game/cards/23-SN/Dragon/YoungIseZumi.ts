import { Duration } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { cannotDeclareRing } from '../../../effects.js';
import { ringLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class YoungIseZumi extends DrawCard {
    static id = 'young-ise-zumi';

    public setupCardAbilities() {
        this.reaction('Prevent a ring from being used for a conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .cost(AbilityDsl.costs.payFateToRing(1, () => true))
            .gameAction(ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.costs.placeFate || context.game.rings.air,
                effect: cannotDeclareRing(() => true)
            })))
            .effect('prevent conflicts from being declared with the {1}', context => [context.costs.placeFate]);
    }
}
