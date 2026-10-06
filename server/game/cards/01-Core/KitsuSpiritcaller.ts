import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, putIntoConflict, returnToDeck } from '../../GameActions/GameActions.js';
import { Duration, Location, Players } from '../../Constants.js';

class KitsuSpiritcaller extends DrawCard {
    static id = 'kitsu-spiritcaller';

    setupCardAbilities() {
        this.action('Resurrect a character')
            .cost(AbilityDsl.costs.bowSelf())
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self
            }, putIntoConflict())
            .effect('call {0} back from the dead until the end of the conflict')
            .then((context) => ({
                gameAction: cardLastingEffect({
                    target: context.target,
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                        messageArgs: [context.target, context.source],
                        gameAction: returnToDeck({ bottom: true })
                    })
                })
            }));
    }
}


export default KitsuSpiritcaller;
