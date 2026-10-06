import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
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
            .cost(AbilityDsl.costs.payHonor(2))
            .gameAction(resolveRingEffect((context) => ({
                player: context.player,
                target: context.event.ring
            })));
    }
}


export default KansenHaunt;
