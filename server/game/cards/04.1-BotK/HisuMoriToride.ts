import { CardType, Duration } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class HisuMoriToride extends StrongholdCard {
    static id = 'hisu-mori-toride-lion';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain additional military conflict',
            effect: 'allow {1} to declare an additional military conflict this phase',
            effectArgs: (context) => [context.player],
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === 'military' &&
                    (event.conflict.skillDifference ?? 0) >= 5
            },
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.sacrifice({
                    cardType: CardType.Character,
                    cardCondition: (card) => card.hasTrait('bushi')
                })
            ],
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict('military')
            }))
        });
    }
}
