import DrawCard from '../../DrawCard.js';
import { DeckType } from '../../Constants.js';

class PrayersToEbisu extends DrawCard {
    static id = 'prayers-to-ebisu';

    override setupCardAbilities() {
        this.action('Re-balance honor and draw a card')
            // the effects resolve together, so an empty deck is reshuffled for the draw, losing honor, before any of them (EmeraldDB ruling)
            .onResolve((context) => {
                if(context.player.conflictDeck.length === 0 && context.player.conflictDiscardPile.length > 0) {
                    context.player.deckRanOutOfCards(DeckType.Conflict);
                }
            })
            .loseHonor((context) => ({
                target: context.game.getPlayers().filter((player) => player.honor >= 19),
                amount: 4
            }))
            .gainHonor((context) => ({
                target: context.game.getPlayers().filter((player) => player.honor <= 6),
                amount: 4
            }))
            .draw((context) => ({
                target: context.player
            }))
            .chatText('draw a card, make each player with 19 or more honor lose 4 honor, and make each player with 6 or fewer honor gain 4 honor');
    }
}


export default PrayersToEbisu;
