import AbilityDsl from '../../../abilitydsl.js';
import { additionalConflict } from '../../../effects.js';
import { playerLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, ConflictType, Duration, Phases } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class HeraldOfJustice extends DrawCard {
    static id = 'herald-of-justice';

    setupCardAbilities() {
        this.action('Gain another military conflict')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .condition((context) => context.game.currentPhase === Phases.Conflict)
            .gameAction(playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: additionalConflict(ConflictType.Military)
            })))
            .effect((context) => msg`allow ${context.player} to declare an additional military conflict this phase`);
    }
}
