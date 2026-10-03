import DrawCard from '../../DrawCard.js';
import { Duration, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SteadfastSamurai extends DrawCard {
    static id = 'steadfast-samurai';

    setupCardAbilities() {
        this.forcedReaction('Can\'t be discarded or remove fate')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [
                    AbilityDsl.effects.cardCannot('removeFate'),
                    AbilityDsl.effects.cardCannot('discardFromPlay')
                ]
            }))
            .effect('stop him being discarded or losing fate in this phase');
    }
}


export default SteadfastSamurai;

