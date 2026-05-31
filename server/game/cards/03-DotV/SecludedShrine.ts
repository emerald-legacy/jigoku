import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Durations, TargetModes, Phases } from '../../Constants.js';

class SecludedShrine extends DrawCard {
    static id = 'secluded-shrine';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Count a ring as claimed',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true,
                gameAction: ability.actions.ringLastingEffect((context: AbilityContext) => ({
                    duration: Durations.UntilEndOfPhase,
                    effect: ability.effects.considerRingAsClaimed((player: any) => player === context.player)
                }))
            },
            effect: 'make it so that they are considered to have claimed {0} until the end of the phase'
        });
    }
}


export default SecludedShrine;
