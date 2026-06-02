import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SteadfastSamurai extends DrawCard {
    static id = 'steadfast-samurai';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.forcedReaction({
            title: 'Can\'t be discarded or remove fate',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            },
            effect: 'stop him being discarded or losing fate in this phase',
            gameAction: ability.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [
                    ability.effects.cardCannot('removeFate'),
                    ability.effects.cardCannot('discardFromPlay')
                ]
            })
        });
    }
}


export default SteadfastSamurai;

