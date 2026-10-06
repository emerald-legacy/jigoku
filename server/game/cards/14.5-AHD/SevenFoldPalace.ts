import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
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
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(gainHonor({ amount: 2 }));
    }
}
