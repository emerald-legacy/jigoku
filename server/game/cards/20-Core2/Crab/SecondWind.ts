import { CardType, Duration, Location, Players } from '../../../Constants.js';
import { delayedEffect } from '../../../effects.js';
import {
    cardLastingEffect,
    discardCard,
    multiple,
    putIntoConflict,
    returnToDeck,
    selectCard,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { msg } from '../../../GameChat.js';

function cardsToDiscard(context: AbilityContext) {
    return context.player.dynastyDeck.slice(0, 4);
}

export default class SecondWind extends DrawCard {
    static id = 'second-wind';

    public setupCardAbilities() {
        this.action('put a character from your discard pile into play')
            .gameAction(sequential([
                discardCard((context) => ({
                    target: cardsToDiscard(context)
                })),
                selectCard((context) => ({
                    location: Location.DynastyDiscardPile,
                    cardType: CardType.Character,
                    cardCondition: (card) => !card.isUnique(),
                    controller: Players.Self,
                    targets: true,
                    gameAction: multiple([
                        putIntoConflict(),
                        cardLastingEffect(() => ({
                            duration: Duration.UntilEndOfPhase,
                            location: [Location.PlayArea],
                            effect: delayedEffect({
                                when: {
                                    onConflictFinished: () => true
                                },
                                gameAction: returnToDeck({ bottom: true })
                            })
                        }))
                    ]),
                    message:
                        '{0} puts {1} into play. {1} will be put on the bottom of the deck if it\'s still in play by the end of the conflict',
                    messageArgs: (card) => [context.player, card, context.source]
                }))
            ]))
            .chatText((context) => msg`find a character to put into play. ${context.player} discards ${cardsToDiscard(context)}`)
            .cannotTargetFirst();
    }
}
