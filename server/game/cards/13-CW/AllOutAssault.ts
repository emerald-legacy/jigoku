import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phase } from '../../Constants.js';
import { mustDeclareMaximumAttackers } from '../../effects.js';

class AllOutAssault extends DrawCard {
    static id = 'all-out-assault';

    setupCardAbilities() {
        this.reaction('Both players must attack with as many characters as they can every conflict')
            .when({
                onPhaseStarted: event => event.phase === Phase.Conflict
            })
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                effect: mustDeclareMaximumAttackers()
            })
            .chatText('force each player to attack with as many characters as they can each conflict');
    }
}


export default AllOutAssault;
