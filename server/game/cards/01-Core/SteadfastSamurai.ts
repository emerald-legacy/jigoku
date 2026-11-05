import DrawCard from '../../DrawCard.js';
import { Duration, Phase, RestrictionType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';
import { msg } from '../../GameChat.js';

class SteadfastSamurai extends DrawCard {
    static id = 'steadfast-samurai';

    override setupCardAbilities() {
        this.forcedReaction('Can\'t be discarded or remove fate')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Fate && context.player.opponent &&
                                                    context.player.honor >= context.player.opponent.honor + 5
            })
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: [
                    cardCannot(RestrictionType.RemoveFate),
                    cardCannot(RestrictionType.DiscardFromPlay)
                ]
            })
            .chatText((context) => msg`stop ${context.source} being discarded or losing fate this phase`);
    }
}


export default SteadfastSamurai;

