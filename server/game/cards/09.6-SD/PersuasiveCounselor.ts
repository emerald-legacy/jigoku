import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class PersuasiveCounselor extends DrawCard {
    static id = 'persuasive-counselor';

    setupCardAbilities() {
        this.action('Prevent your events from being cancelled')
            .condition(context => context.source.isParticipating())
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                duration: Duration.UntilEndOfConflict,
                targetController: context.player,
                effect: AbilityDsl.effects.eventsCannotBeCancelled()
            })))
            .effect('prevent their events from being cancelled this conflict');
    }
}


export default PersuasiveCounselor;
