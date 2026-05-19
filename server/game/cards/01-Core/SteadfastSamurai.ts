import DrawCard from '../../drawcard.js';
import { Durations, Phases } from '../../Constants.js';

class SteadfastSamurai extends DrawCard {
    static id = 'steadfast-samurai';

    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Can\'t be discarded or remove fate',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            },
            effect: 'stop him being discarded or losing fate in this phase',
            gameAction: ability.actions.cardLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: [
                    ability.effects.cardCannot('removeFate'),
                    ability.effects.cardCannot('discardFromPlay')
                ]
            })
        });
    }
}


export default SteadfastSamurai;

