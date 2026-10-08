import { considerRingAsClaimed } from '../../effects.js';
import { ringLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Phase } from '../../Constants.js';

class SecludedShrine extends DrawCard {
    static id = 'secluded-shrine';

    setupCardAbilities() {
        this.reaction('Count a ring as claimed')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .ringTarget({
                ringCondition: () => true
            }, ringLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: considerRingAsClaimed((player) => player === context.player)
            })))
            .chatText('make it so that they are considered to have claimed {0} until the end of the phase');
    }
}


export default SecludedShrine;
