import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            .cost(AbilityDsl.costs.discardCard({
                location: Location.Hand,
                cardCondition: (card, context) => card !== context.source
            }))
            .gameAction(AbilityDsl.actions.cancel());
    }

    private hasEqualOrLessSkill(conflict: Conflict, player: Player): boolean {
        return conflict.defendingPlayer === player
            ? conflict.defenderSkill <= conflict.attackerSkill
            : conflict.attackerSkill <= conflict.defenderSkill;
    }
}
