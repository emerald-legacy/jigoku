import DrawCard from '../../DrawCard.js';
import { canPlayFromOpponents, canPlayFromOwn } from '../../effects.js';
import { cancel, lookAt, moveCard, multiple, playerLastingEffect } from '../../GameActions/GameActions.js';
import { Location, Duration, Phase } from '../../Constants.js';

class TradingOnTheSandRoad extends DrawCard {
    static id = 'trading-on-the-sand-road';

    setupCardAbilities() {
        this.interrupt('Take top 4 cards from both players\' decks')
            .when({
                onPhaseCreated: (event) => event.phase === Phase.Draw
            })
            .gameAction(multiple([
                cancel(),
                lookAt((context)=> ({
                    target: context.player.conflictDeck.slice(0, 4),
                    message: '{0} removes the top {1} cards from their conflict deck from the game: {2}',
                    messageArgs: (cards) => [context.player, cards.length, cards]
                })),
                lookAt((context)=> ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                    message: '{0} removes the top {1} cards from their conflict deck from the game: {2}',
                    messageArgs: (cards) => [context.player.opponent, cards.length, cards]
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilEndOfRound,
                    effect: [
                        canPlayFromOwn(Location.RemovedFromGame, context.player.conflictDeck.slice(0, 4), this),
                        canPlayFromOpponents(
                            Location.RemovedFromGame,
                            context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [], this)
                    ]

                })),
                playerLastingEffect((context) => ({
                    targetController: context.player.opponent,
                    duration: Duration.UntilEndOfRound,
                    effect: [
                        canPlayFromOwn(Location.RemovedFromGame,
                            context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [], this),
                        canPlayFromOpponents(
                            Location.RemovedFromGame,
                            context.player.opponent ? context.player.conflictDeck.slice(0, 4) : [],
                            this
                        )
                    ]
                })),
                moveCard((context) => ({
                    target: context.player.conflictDeck.slice(0, 4),
                    destination: Location.RemovedFromGame
                })),
                moveCard((context) => ({
                    target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                    destination: Location.RemovedFromGame
                }))
            ]))
            .chatText('remove the top 4 cards from each player\'s deck and make them playable by both players until the end of the round');
    }
}


export default TradingOnTheSandRoad;
