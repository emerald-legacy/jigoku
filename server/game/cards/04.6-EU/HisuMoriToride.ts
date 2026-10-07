import { CardType, Duration, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { additionalConflict } from '../../effects.js';
import { msg } from '../../GameChat.js';

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
            .playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict('military')
            }))
            .effect((context) => msg`allow ${context.player} to declare an additional military conflict this phase`);
    }
}
