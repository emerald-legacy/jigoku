import { msg } from '../../GameChat.js';
import { CardType, Duration, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { delayedEffect } from '../../effects.js';
import {
    cardLastingEffect,
    discardCard,
    multiple,
    putIntoPlay,
    returnToDeck,
    selectCard,
    sequential
} from '../../GameActions/GameActions.js';

export default class SpectralVisitation extends ProvinceCard {
    static id = 'spectral-visitation';

    override setupCardAbilities() {
        this.reaction('put a character from your discard pile into play')
            .when({
                onCardRevealed: (event, context) => context.source === event.card
            })
            // errata: the discard is after the dash, "Then" chooses whether or not 4 cards were discarded
            .gameAction(sequential([
                discardCard((context) => ({ target: context.player.dynastyDeck.slice(0, 4) })),
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
                    message: (context, card) => msg`${context.player} puts ${card} into play. ${card} will be put on the bottom of the deck if it's still in play by the end of the phase`
                })
            ]))
            .chatText((context) => msg`discard ${context.player.dynastyDeck.slice(0, 4)} and put a dynasty character into play`)
            .cannotTargetFirst();
    }
}
