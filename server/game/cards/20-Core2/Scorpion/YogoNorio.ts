import { CardType, Duration, ConflictType, Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { additionalConflict } from '../../../effects.js';
import { playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class YogoNorio extends DrawCard {
    static id = 'yogo-norio';

    setupCardAbilities() {
        this.action('Gain another political conflict')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character
            }))
            .condition((context) => context.game.currentPhase === Phases.Conflict)
            .gameAction(playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Political)
            })))
            .effect('allow {1} to declare an additional political conflict this phase', (context) => [context.player]);
    }
}
