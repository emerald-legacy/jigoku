import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { delayedEffect } from '../../effects.js';
import { putIntoConflict, returnToDeck } from '../../GameActions/GameActions.js';
import { Duration, Location, Players } from '../../Constants.js';

class KitsuSpiritcaller extends DrawCard {
    static id = 'kitsu-spiritcaller';

    setupCardAbilities() {
        this.action('Resurrect a character')
            .cost(costs.bowSelf())
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self
            }, putIntoConflict())
            .chatText('call {0} back from the dead until the end of the conflict')
            .then()
            .cardLastingEffect((context) => ({
                target: context.target,
                duration: Duration.UntilEndOfPhase,
                effect: delayedEffect({
                    when: {
                        onConflictFinished: () => true
                    },
                    message: () => msg`${context.target} returns to the bottom of the deck due to ${context.source}'s effect`,
                    gameAction: returnToDeck({ bottom: true })
                })
            }));
    }
}


export default KitsuSpiritcaller;
