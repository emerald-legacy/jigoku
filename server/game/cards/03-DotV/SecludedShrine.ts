import type AbilityDsl from '../../abilitydsl.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';

class SecludedShrine extends DrawCard {
    static id = 'secluded-shrine';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Count a ring as claimed')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .ringTarget('target', {
                ringCondition: () => true
            }, ability.actions.ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: ability.effects.considerRingAsClaimed((player: Player) => player === context.player)
            })))
            .effect('make it so that they are considered to have claimed {0} until the end of the phase');
    }
}


export default SecludedShrine;
