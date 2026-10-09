import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, DeckType, Location, RemainingCards, TargetMode } from '../../Constants.js';
import { deckSearch, rearrangeDeck } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';

class Compass extends DrawCard {
    static id = 'compass';

    setupCardAbilities() {
        this.reaction('Look at top 3 cards of a deck')
            .when({
                onCardRevealed: (event, context) =>
                    event.card.type === CardType.Province && event.card.controller === context.player.opponent &&
                    context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                    (context.player.dynastyDeck.length > 0 || context.player.conflictDeck.length > 0)
            })
            .handler((context) => {
                const decks = [
                    { text: 'Dynasty Deck', location: Location.DynastyDeck, deck: DeckType.Dynasty },
                    { text: 'Conflict Deck', location: Location.ConflictDeck, deck: DeckType.Conflict }
                ] as const;
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a deck',
                    options: decks
                        .filter(({ location }) => context.player.getSourceList(location).length > 0)
                        .map(({ text, location, deck }) => ({
                            text,
                            handler: () => {
                                this.game.addMessage(msg`${context.player} chooses to look at the top 3 cards of their ${location}`);
                                deckSearch({
                                    activePromptTitle: 'Choose a card to place on the bottom of your deck',
                                    cardsToLookAt: 3,
                                    deck,
                                    mode: TargetMode.Unlimited,
                                    doneButtonText: 'Done',
                                    remainingCards: RemainingCards.TopAnyOrder,
                                    selectedCardsHandler: (context, _event, cards) => this.placeOnBottom(context, cards, location),
                                    remainingCardsHandler: (context, _event, cards) => this.placeOnTop(context, cards, deck, location)
                                }).resolve(context.player, context);
                            }
                        }))
                });
            })
            .chatText('look at the top 3 cards of one of their decks');
    }

    private placeOnBottom(context: AbilityContext, cards: DrawCard[], location: Location): void {
        if(cards.length === 0) {
            return;
        }
        for(const card of cards) {
            context.player.moveCard(card, location, { bottom: true });
        }
        this.game.addMessage(msg`${context.player} places ${cards.length} card${cards.length > 1 ? 's' : ''} on the bottom of their ${location}`);
    }

    /** Like `RemainingCards.TopAnyOrder`, with a chat line. */
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
