import { CardType, Duration, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

export default class HisuMoriToride extends StrongholdCard {
    static id = 'hisu-mori-toride-lion';

    setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictType.Military &&
                    (event.conflict.skillDifference ?? 0) >= 5
            })
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi')
            }))
            .gameAction(playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict('military')
            })))
            .effect((context) => msg`allow ${context.player} to declare an additional military conflict this phase`);
    }
}
