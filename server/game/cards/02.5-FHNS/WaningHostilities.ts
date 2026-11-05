import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phase } from '../../Constants.js';
import { setMaxConflicts } from '../../effects.js';

class WaningHostilities extends DrawCard {
    static id = 'waning-hostilities';

    override setupCardAbilities() {
        this.reaction('Each player has 1 conflict opportunity this phase')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                target: Players.Any,
                effect: setMaxConflicts(1)
            })
            .chatText('limit both players to a single conflict this phase');
    }
}


export default WaningHostilities;
