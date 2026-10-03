import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class HisuMoriToride extends StrongholdCard {
    static id = 'hisu-mori-toride-lion';

    setupCardAbilities() {
        this.reaction('Gain additional military conflict')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === 'military' &&
                    (event.conflict.skillDifference ?? 0) >= 5
            })
            .cost(AbilityDsl.costs.bowSelf())
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi')
            }))
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict('military')
            })))
            .effect('allow {1} to declare an additional military conflict this phase', (context) => [context.player]);
    }
}
