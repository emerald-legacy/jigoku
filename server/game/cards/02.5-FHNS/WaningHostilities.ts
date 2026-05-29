import DrawCard from '../../DrawCard.js';
import { Durations, Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WaningHostilities extends DrawCard {
    static id = 'waning-hostilities';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Both players may only declare 1 conflict opportunity this turn',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'limit both players to a single conflict this turn',
            gameAction: ability.actions.playerLastingEffect({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Any,
                effect: ability.effects.setMaxConflicts(1)
            })
        });
    }
}


export default WaningHostilities;
