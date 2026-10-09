import { msg } from '../../GameChat.js';
import { reduceCost } from '../../effects.js';
import { Location, Players, CardType, DeckType, TargetMode } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { controlsShugenja } from '../controlsShugenja.js';

class WalkingTheWay extends DrawCard {
    static id = 'walking-the-way';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => controlsShugenja(player),
            effect: reduceCost({ match: (card, source) => card === source })
        });

        this.action('Place a card from your deck faceup on a province')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .deckSearch({
                activePromptTitle: 'Choose a card to place in a province',
                cardsToLookAt: 3,
                deck: DeckType.Dynasty,
                mode: TargetMode.Exactly,
                numCards: 1,
                selectedCardsHandler: (context, _event, [cardFromDeck]) => cardFromDeck && this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to replace with ' + cardFromDeck.name,
                    context: context,
                    cardType: [CardType.Holding, CardType.Character, CardType.Event],
                    location: Location.Provinces,
                    controller: Players.Self,
                    onSelect: (player, card) => {
                        this.game.addMessage(msg`${player} discards ${card}, replacing it with ${cardFromDeck}`);
                        player.moveCard(cardFromDeck, card.location);
                        cardFromDeck.facedown = false;
                        player.moveCard(card, Location.DynastyDiscardPile);
                        return true;
                    }
                })
            })
            .chatText('look at the top three cards of their dynasty deck');
    }
}


export default WalkingTheWay;
