
import { CardType, DeckType, Location, RemainingCards, Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { moveCard, placeInProvince, rearrangeDeck, sequential } from '../../GameActions/GameActions.js';

class MiyaLibrary extends DrawCard {
    static id = 'miya-library';

    override setupCardAbilities() {
        this.action('Replace Miya Library for a faceup imperial character')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .deckSearch({
                activePromptTitle: 'Select an Imperial character to replace Miya Library',
                cardsToLookAt: 4,
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.hasTrait(Trait.Imperial) && card.type === CardType.Character,
                doneButtonText: 'Do not replace Miya Library',
                remainingCards: RemainingCards.TopAnyOrder,
                selectedCardsHandler: (context, _event, [card]) => {
                    if(card) {
                        sequential([
                            placeInProvince({ target: card, destination: context.source.location }),
                            moveCard({ target: context.source, destination: Location.DynastyDeck })
                        ]).resolve(context.player, context);
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
