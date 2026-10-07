import { CardType, Decks, Duration, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import * as costs from '../../costs/index.js';
import { delayedEffect } from '../../effects.js';
import {
    cardLastingEffect,
    handler,
    multiple,
    putIntoPlay,
    returnToDeck,
    selectCard,
    sequential
} from '../../GameActions/GameActions.js';

export default class SpectralVisitation extends ProvinceCard {
    static id = 'spectral-visitation';

    setupCardAbilities() {
        this.reaction('put a character from your discard pile into play')
            .when({
                onCardRevealed: (event, context) => context.source === event.card
            })
            .cost(costs.discardTopCardsFromDeck({ amount: 4, deck: Decks.DynastyDeck }))
            .gameAction(sequential([
                // always legal, so this can trigger when only the cards the cost discards give it a choice
                handler({
                    handler: () => true
                }),
                selectCard((context) => ({
                    location: Location.DynastyDiscardPile,
                    cardType: CardType.Character,
                    controller: Players.Self,
                    targets: true,
                    gameAction: multiple([
                        putIntoPlay(),
                        cardLastingEffect((context) => ({
                            duration: Duration.UntilEndOfRound,
                            effect: delayedEffect({
                                when: {
                                    onPhaseEnded: () => true
                                },
                                message: '{0} returns to the bottom of the deck due to {1}\'s effect',
                                messageArgs: (_effectContext, effectTargets) => [effectTargets, context.source],
                                gameAction: returnToDeck({ bottom: true })
                            })
                        }))
                    ]),
                    message:
                        '{0} puts {1} into play. {1} will be put on the bottom of the deck if it\'s still in play by the end of the phase',
                    messageArgs: (card) => [context.player, card, context.source]
                }))
            ]))
            .effect('put a dynasty character into play')
            .cannotTargetFirst();
    }
}
