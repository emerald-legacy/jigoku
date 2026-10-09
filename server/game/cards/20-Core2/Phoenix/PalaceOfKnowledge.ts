import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { resolveRingEffect } from '../../../GameActions/GameActions.js';

export default class PalaceOfKnowledge extends StrongholdCard {
    static id = 'palace-of-knowledge';

    setupCardAbilities() {
        this.reaction('Resolve another ring effect')
            .when({
                onResolveRingElement: (event, context) =>
                    event.player === context.player && event.effectivellyResolvedEffect
            })
            .cost(costs.bowSelf())
            .cost(costs.discardCard())
            .ringTarget({
                activePromptTitle: 'Choose a ring',
                ringCondition: (ring, context) =>
                    ring !== context.event.ring && ring.isUnclaimed()
            }, resolveRingEffect());
    }
}
