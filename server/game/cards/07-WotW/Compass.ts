import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, DeckType, Location, TargetMode } from '../../Constants.js';
import { deckSearch, moveCard, rearrangeDeck } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';

class Compass extends DrawCard {
    static id = 'compass';

    override setupCardAbilities() {
        this.reaction('Look at top 3 cards of a deck')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.type === CardType.Province && event.card.controller === context.player.opponent &&
                    context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                    (context.player.dynastyDeck.length > 0 || context.player.conflictDeck.length > 0)
            })
            .chooseAction({
                activePromptTitle: 'Choose a deck',
                choices: {
                    'Dynasty Deck': this.lookAtTopThree(DeckType.Dynasty, Location.DynastyDeck),
                    'Conflict Deck': this.lookAtTopThree(DeckType.Conflict, Location.ConflictDeck)
                }
            })
            .chatText('look at the top 3 cards of one of their decks');
    }

    private lookAtTopThree(deck: DeckType, location: Location.DynastyDeck | Location.ConflictDeck) {
        return {
            action: deckSearch({
                activePromptTitle: 'Choose a card to place on the bottom of your deck',
                cardsToLookAt: 3,
                deck,
                mode: TargetMode.Unlimited,
                doneButtonText: 'Done',
                gameAction: moveCard({ destination: location, bottom: true }),
                message: (context, cards) => msg`${context.player} places ${cards.length} card${cards.length > 1 ? 's' : ''} on the bottom of their ${location}`,
                takesNothingMessage: () => undefined,
                remainingCardsHandler: (context, _event, cards) => this.placeOnTop(context, cards, deck, location)
            }),
            message: (context: AbilityContext) => msg`${context.player} chooses to look at the top 3 cards of their ${location}`
        };
    }

    private placeOnTop(context: AbilityContext, cards: DrawCard[], deck: DeckType, location: Location): void {
        if(cards.length < 2) {
            return;
        }
        rearrangeDeck({
            cards,
            deck,
            message: (context, ordered) => msg`${context.player} places ${ordered.length} cards on top of their ${location}`
        }).resolve(context.player, context);
    }
}


export default Compass;
