import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phases } from '../../Constants.js';
import { setMaxConflicts } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class WaningHostilities extends DrawCard {
    static id = 'waning-hostilities';

    setupCardAbilities() {
        this.reaction('Both players may only declare 1 conflict opportunity this turn')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                effect: setMaxConflicts(1)
            }))
            .effect('limit both players to a single conflict this turn');
    }
}


export default WaningHostilities;
