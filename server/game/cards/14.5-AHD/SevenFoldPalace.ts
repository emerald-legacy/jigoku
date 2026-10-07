import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { gainHonor } from '../../GameActions/GameActions.js';

export default class SevenFoldPalace extends StrongholdCard {
    static id = 'seven-fold-palace';

    setupCardAbilities() {
        this.reaction('Gain 2 Honor')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    context.player.isAttackingPlayer() &&
                    event.conflict.getAttackers().some((card) => card.isHonored && card.controller === context.player)
            })
            .cost(costs.bowSelf())
            .gameAction(gainHonor({ amount: 2 }));
    }
}
