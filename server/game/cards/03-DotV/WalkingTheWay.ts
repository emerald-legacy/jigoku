import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class WalkingTheWay extends DrawCard {
    static id = 'walking-the-way';

    setupCardAbilities() {
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            match: (player) => player.cardsInPlay.some((card) => card.hasTrait('shugenja')),
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.action('Place a card from your deck faceup on a province')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .handler((context) => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to place in a province',
                    context: context,
                    cards: context.player.dynastyDeck.slice(0, 3),
                    cardHandler: (cardFromDeck) => this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a card to replace with ' + cardFromDeck.name,
                        context: context,
                        cardType: [CardType.Holding, CardType.Character, CardType.Event],
                        location: Location.Provinces,
                        controller: Players.Self,
                        onSelect: (player, card) => {
                            this.game.addMessage('{0} discards {1}, replacing it with {2}', player, card, cardFromDeck);
                            player.moveCard(cardFromDeck, card.location);
                            cardFromDeck.facedown = false;
                            player.moveCard(card, Location.DynastyDiscardPile);
                            player.shuffleDynastyDeck();
                            return true;
                        }
                    })
                });
            })
            .effect('look at the top three cards of their dynasty deck');
    }
}


export default WalkingTheWay;
