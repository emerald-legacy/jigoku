import { Durations } from '../../../Constants.js';
import type { TriggeredAbilityContext } from "../../../TriggeredAbilityContext.js";
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class TheSunWillRiseAgain extends DrawCard {
    static id = 'the-sun-will-rise-again';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain an additional conflict',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.attackingPlayer === context.player &&
                    event.conflict.winner === context.player.opponent &&
                    (event.conflict.skillDifference ?? 0) >= 4
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.additionalConflict((context as TriggeredAbilityContext).event.conflict.conflictType)
            })),
            max: AbilityDsl.limit.perConflict(1),
            effect: 'gain an additional {1} conflict this round. They will not forget this defeat.',
            effectArgs: (context) => [context.event.conflict.conflictType]
        });
    }
}
