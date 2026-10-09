import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { resolveRingEffect } from '../../GameActions/GameActions.js';

class KansenHaunt extends DrawCard {
    static id = 'kansen-haunt';

    setupCardAbilities() {
        this.reaction('Resolve ring effect')
            .when({
                onClaimRing: (event, context) =>
                    context.player.opponent &&
                    context.player.isLessHonorable() &&
                    context.player.isDefendingPlayer() &&
                    event.player === context.player
            })
            .cost(costs.payHonor(2))
            .gameAction(resolveRingEffect((context) => ({
                player: context.player,
                target: context.event.ring
            })));
    }
}


export default KansenHaunt;
