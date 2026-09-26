import DrawCard from '../../DrawCard.js';
import { Duration, Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WaningHostilities extends DrawCard {
    static id = 'waning-hostilities';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Both players may only declare 1 conflict opportunity this turn')
            .when({
                onPhaseStarted: event => event.phase === Phases.Conflict
            })
            .gameAction(ability.actions.playerLastingEffect({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                effect: ability.effects.setMaxConflicts(1)
            }))
            .effect('limit both players to a single conflict this turn');
    }
}


export default WaningHostilities;
