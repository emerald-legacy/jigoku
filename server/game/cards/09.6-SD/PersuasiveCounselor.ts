import DrawCard from '../../DrawCard.js';
import { eventsCannotBeCancelled } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';

class PersuasiveCounselor extends DrawCard {
    static id = 'persuasive-counselor';

    setupCardAbilities() {
        this.action('Prevent your events from being cancelled')
            .condition(context => context.source.isParticipating())
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player,
                effect: eventsCannotBeCancelled()
            })))
            .effect('prevent their events from being cancelled this conflict');
    }
}


export default PersuasiveCounselor;
