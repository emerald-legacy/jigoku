import { CardTypes, Durations, ConflictTypes, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class HeraldOfJustice extends DrawCard {
    static id = 'herald-of-justice';

    setupCardAbilities() {
        this.action({
            title: 'Gain another military conflict',
            effect: 'allow {1} to declare an additional military conflict this phase',
            effectArgs: (context) => [context.player],
            condition: (context) => context.game.currentPhase === Phases.Conflict,
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.source
            }),
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(ConflictTypes.Military)
            }))
        });
    }
}
