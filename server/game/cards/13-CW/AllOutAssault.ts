import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phases } from '../../Constants.js';
import { mustDeclareMaximumAttackers } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class AllOutAssault extends DrawCard {
    static id = 'all-out-assault';

    setupCardAbilities() {
        this.reaction('Both players must attack with as many characters as they can every conflict')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                effect: mustDeclareMaximumAttackers()
            }))
            .effect('force each player to attack with as many characters as they can each conflict');
    }
}


export default AllOutAssault;
