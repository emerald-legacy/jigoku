import DrawCard from '../../drawcard.js';
import { Durations, Players, TargetModes, Phases } from '../../Constants.js';

class MasterOfGiseiToshi extends DrawCard {
    static id = 'master-of-gisei-toshi';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent non-spell events from being played while contesting a ring',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Ring,
                ringCondition: () => true
            },
            effect: 'prevent non-spell events from being played while {0} is contested',
            gameAction: ability.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                targetController: Players.Any,
                condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.ring,
                effect: ability.effects.playerCannot({
                    cannot: 'play',
                    restricts: 'nonSpellEvents'
                })
            }))
        });
    }
}


export default MasterOfGiseiToshi;
