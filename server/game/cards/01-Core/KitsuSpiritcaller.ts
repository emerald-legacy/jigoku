import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration, Location, Players } from '../../Constants.js';

class KitsuSpiritcaller extends DrawCard {
    static id = 'kitsu-spiritcaller';

    setupCardAbilities() {
        this.action({
            title: 'Resurrect a character',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                gameAction: AbilityDsl.actions.putIntoConflict()
            },
            effect: 'call {0} back from the dead until the end of the conflict',
            then: (context: AbilityContext) => ({
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    target: context.target,
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                        messageArgs: [context.target, context.source],
                        gameAction: AbilityDsl.actions.returnToDeck({ bottom: true })
                    })
                })
            })
        });
    }
}


export default KitsuSpiritcaller;
