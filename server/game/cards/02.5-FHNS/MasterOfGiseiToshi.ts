import DrawCard from '../../DrawCard.js';
import { Duration, EventName, Phases, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class MasterOfGiseiToshi extends DrawCard {
    static id = 'master-of-gisei-toshi';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Prevent non-spell events from being played while contesting a ring')
            .when({
                onPhaseStarted: (event: EventPayload<EventName.OnPhaseStarted>) => event.phase === Phases.Conflict
            })
            .ringTarget('target', {
                ringCondition: () => true
            })
            .gameAction(ability.actions.playerLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict?.ring === context.ring,
                effect: ability.effects.playerCannot({
                    cannot: 'play',
                    restricts: 'nonSpellEvents'
                })
            })))
            .effect('prevent non-spell events from being played while {0} is contested');
    }
}


export default MasterOfGiseiToshi;
