import { CardType, Duration, ConflictType, EffectName, Trait } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { additionalConflict } from '../../effects.js';
import { msg } from '../../GameChat.js';

export default class HisuMoriToride extends StrongholdCard {
    static id = 'hisu-mori-toride-unicorn';

    override setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictType.Military &&
                    !!context.game.currentConflict &&
                    context.game.currentConflict.hasMoreParticipants(context.player)
            })
            // under Waning Hostilities an additional conflict changes nothing
            .condition((context) => !context.player.anyEffect(EffectName.SetMaxConflicts))
            .cost(costs.bowSelf())
            .cost(costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait(Trait.Cavalry)
            }))
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Military)
            })
            .chatText((context) => msg`allow ${context.player} to declare an additional military conflict this phase`);
    }
}
