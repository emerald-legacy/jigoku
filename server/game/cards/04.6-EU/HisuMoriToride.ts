import { CardType, Duration, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

export default class HisuMoriToride extends StrongholdCard {
    static id = 'hisu-mori-toride-unicorn';

    setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictType.Military &&
                    !!context.game.currentConflict &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            })
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('cavalry')
            }))
            .gameAction(playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict('military')
            })))
            .effect('allow {1} to declare an additional military conflict this phase', (context) => [context.player]);
    }
}
