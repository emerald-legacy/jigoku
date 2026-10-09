import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phase } from '../../Constants.js';
import { setMaxConflicts } from '../../effects.js';

class WaningHostilities extends DrawCard {
    static id = 'waning-hostilities';

    setupCardAbilities() {
        this.reaction('Both players may only declare 1 conflict opportunity this turn')
            .when({
                onPhaseStarted: (event) => event.phase === Phase.Conflict
            })
            .playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                effect: setMaxConflicts(1)
            })
            .chatText('limit both players to a single conflict this turn');
    }
}


export default WaningHostilities;
