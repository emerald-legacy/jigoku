import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';

class SecludedShrine extends DrawCard {
    static id = 'secluded-shrine';

    setupCardAbilities() {
        this.reaction('Count a ring as claimed')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .ringTarget('target', {
                ringCondition: () => true
            }, AbilityDsl.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.considerRingAsClaimed((player) => player === context.player)
            })))
            .effect('make it so that they are considered to have claimed {0} until the end of the phase');
    }
}


export default SecludedShrine;
