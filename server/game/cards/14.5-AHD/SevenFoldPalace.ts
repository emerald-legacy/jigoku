import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';

export default class SevenFoldPalace extends StrongholdCard {
    static id = 'seven-fold-palace';

    override setupCardAbilities() {
        this.reaction('Gain 2 Honor')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.isAttackerTheWinner() &&
                    event.conflict.getAttackers().some((card) => card.isHonored && card.controller === context.player)
            })
            .cost(costs.bowSelf())
            .gainHonor(2);
    }
}
