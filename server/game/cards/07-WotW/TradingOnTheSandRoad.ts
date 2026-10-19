import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { canPlayFromOpponents, canPlayFromOwn } from '../../effects.js';
import { Location, Duration, Phase, Players } from '../../Constants.js';

class TradingOnTheSandRoad extends DrawCard {
    static id = 'trading-on-the-sand-road';

    override setupCardAbilities() {
        this.wouldInterrupt('Take top 4 cards from both players\' decks')
            .when({
                onPhaseCreated: (event) => event.phase === Phase.Draw
            })
            .cancel()
            .lookAt((context)=> ({
                target: context.player.conflictDeck.slice(0, 4),
                message: (context, cards) => msg`${context.player} removes the top ${cards.length} cards from their conflict deck from the game: ${cards}`
            }))
            .lookAt((context)=> ({
                target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                message: (context, cards) => msg`${context.player.opponent} removes the top ${cards.length} cards from their conflict deck from the game: ${cards}`
            }))
            .playerLastingEffect((context) => ({
                target: Players.Self,
                duration: Duration.UntilEndOfRound,
                effect: [
                    canPlayFromOwn(Location.RemovedFromGame, context.player.conflictDeck.slice(0, 4), this),
                    canPlayFromOpponents(
                        Location.RemovedFromGame,
                        context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [], this)
                ]

            }))
            .playerLastingEffect((context) => ({
                target: context.player.opponent,
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
            }))
            .moveCard((context) => ({
                target: context.player.conflictDeck.slice(0, 4),
                destination: Location.RemovedFromGame
            }))
            .moveCard((context) => ({
                target: context.player.opponent ? context.player.opponent.conflictDeck.slice(0, 4) : [],
                destination: Location.RemovedFromGame
            }))
            .chatText('remove the top 4 cards from each player\'s deck and make them playable by both players until the end of the round')
            // its effects use its triggering condition (developer ruling on The Mirror's Gaze)
            .cannotBeMirrored();
    }
}


export default TradingOnTheSandRoad;
