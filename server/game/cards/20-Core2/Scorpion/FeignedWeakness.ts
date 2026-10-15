import { CardType, Location } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import DrawCard from '../../../DrawCard.js';
import type { Conflict } from '../../../Conflict.js';
import type Player from '../../../Player.js';

export default class FeignedWeakness extends DrawCard {
    static id = 'feigned-weakness';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.card.type === CardType.Event &&
                    !!context.game.currentConflict && this.hasEqualOrLessSkill(context.game.currentConflict, context.player)
            })
            .cost(costs.discardCard({
                location: Location.Hand,
                cardCondition: (card, context) => card !== context.source
            }))
            .cancel();
    }

    private hasEqualOrLessSkill(conflict: Conflict, player: Player): boolean {
        return conflict.defendingPlayer === player
            ? conflict.defenderSkill <= conflict.attackerSkill
            : conflict.attackerSkill <= conflict.defenderSkill;
    }
}
