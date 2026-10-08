import { Duration, Location, Players } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { delayedEffect } from '../../../effects.js';
import { putIntoConflict, returnToDeck } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KitsuSpiritcaller2 extends DrawCard {
    static id = 'kitsu-spiritcaller-2';

    setupCardAbilities() {
        this.conflictAction('Resurrect a character', { evenFromHome: true })
            .cost(costs.bowSelf())
            .target({
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => card.isFaction('lion')
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
                    message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                    messageArgs: [context.target, context.source],
                    gameAction: returnToDeck({ bottom: true })
                })
            }));
    }
}
