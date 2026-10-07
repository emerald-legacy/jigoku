import DrawCard from '../../DrawCard.js';
import { Duration, Phases, Players } from '../../Constants.js';
import { playerCannot } from '../../effects.js';

class MasterOfGiseiToshi extends DrawCard {
    static id = 'master-of-gisei-toshi';

    setupCardAbilities() {
        this.reaction('Prevent non-spell events from being played while contesting a ring')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .ringTarget({
                ringCondition: () => true
            })
            .playerLastingEffect(context => ({
                duration: Duration.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict?.ring === context.ring,
                effect: playerCannot({
                    cannot: 'play',
                    restricts: 'nonSpellEvents'
                })
            }))
            .effect('prevent non-spell events from being played while {0} is contested');
    }
}


export default MasterOfGiseiToshi;
