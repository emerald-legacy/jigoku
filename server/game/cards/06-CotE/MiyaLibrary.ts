
import { CardType, DeckType, Location, RemainingCards } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { rearrangeDeck } from '../../GameActions/GameActions.js';

class MiyaLibrary extends DrawCard {
    static id = 'miya-library';

    setupCardAbilities() {
        this.action('Replace Miya Library for a faceup imperial character')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .deckSearch({
                activePromptTitle: 'select an imperial character to replace miya library',
                cardsToLookAt: 4,
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.hasTrait('imperial') && card.type === CardType.Character,
                doneButtonText: 'Do not replace Miya Library',
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, [card]) => {
                    if(card) {
                        context.player.moveCard(card, context.source.location);
                        card.facedown = false;
                        context.player.moveCard(context.source, Location.DynastyDeck);
                    }
                },
                remainingCardsHandler: (context, _event, cards) => rearrangeDeck({
                    cards: this.location === Location.DynastyDeck ? [this, ...cards] : cards,
                    deck: DeckType.Dynasty,
                    activePromptTitle: 'Select the card you would like to place on top of your dynasty deck'
                }).resolve(context.player, context)
            })
            .chatText('search the top four cards of their dynasty deck for an Imperial character');
    }
}


export default MiyaLibrary;
