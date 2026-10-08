import DrawCard from '../../DrawCard.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, discardStatusToken, honor, multiple } from '../../GameActions/GameActions.js';
import { Duration, CardType } from '../../Constants.js';

class PurityOfSpirit extends DrawCard {
    static id = 'purity-of-spirit';

    setupCardAbilities() {
        this.action('Choose a bushi character to honor')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi') && card.isParticipating()
            }, multiple([
                honor(),
                cardLastingEffect((context) => ({
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when : {
                            onConflictFinished: () => true
                        },
                        message: '{0} {3} removed from {1} due to the delayed effect of {2}',
                        messageArgs: [context.target.statusTokens, context.target, context.source, context.target.statusTokens.length > 1 ? 'are' : 'is'],
                        gameAction: discardStatusToken(() => ({ target: context.target.statusTokens }))
                    })
                }))
            ]))
            .chatText('honor {0}. Their status token will be discarded at the end of the conflict');
    }
}


export default PurityOfSpirit;
