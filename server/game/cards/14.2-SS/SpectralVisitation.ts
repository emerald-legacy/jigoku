import { msg } from '../../GameChat.js';
import { CardType, DeckType, Duration, Location, Players } from '../../Constants.js';
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
            .cost(costs.discardTopCardsFromDeck({ amount: 4, deck: DeckType.Dynasty }))
            .gameAction(sequential([
                // always legal, so this can trigger when only the cards the cost discards give it a choice
                handler({
                    handler: () => true
                }),
                selectCard({
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
                                message: (_effectContext, effectTargets) => msg`${effectTargets} returns to the bottom of the deck due to ${context.source}'s effect`,
                                gameAction: returnToDeck({ bottom: true })
                            })
                        }))
                    ]),
                    message: (context, card) => msg`${context.player} puts ${card} into play. ${card} will be put on the bottom of the deck if it's still in play by the end of the phase`})
            ]))
            .chatText('put a dynasty character into play')
            .cannotTargetFirst();
    }
}
