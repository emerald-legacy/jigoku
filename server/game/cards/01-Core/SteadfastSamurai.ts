import DrawCard from '../../DrawCard.js';
import { Duration, Phase } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class SteadfastSamurai extends DrawCard {
    static id = 'steadfast-samurai';

    setupCardAbilities() {
        this.forcedReaction('Can\'t be discarded or remove fate')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Fate && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            })
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [
                    cardCannot('removeFate'),
                    cardCannot('discardFromPlay')
                ]
            })
            .effect('stop him being discarded or losing fate in this phase');
    }
}


export default SteadfastSamurai;

