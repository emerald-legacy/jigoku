import { CardType, Duration, ConflictType, Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class YogoNorio extends DrawCard {
    static id = 'yogo-norio';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character
            }))
            .condition((context) => context.game.currentPhase === Phases.Conflict)
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict(ConflictType.Political)
            })))
            .effect('allow {1} to declare an additional political conflict this phase', (context) => [context.player]);
    }
}
