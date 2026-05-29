import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import type Player from '../../player.js';
import { Locations, Players, CardTypes } from '../../Constants.js';
import DrawCard from '../../drawcard.js';

class WalkingTheWay extends DrawCard {
    static id = 'walking-the-way';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            match: (player: Player) => player.cardsInPlay.some((card: BaseCard) => card.hasTrait('shugenja')),
            effect: ability.effects.reduceCost({ match: (card: BaseCard, source: BaseCard) => card === source })
        });

        this.action({
            title: 'Place a card from your deck faceup on a province',
            condition: (context: AbilityContext) => context.player.dynastyDeck.length > 0,
            effect: 'look at the top three cards of their dynasty deck',
            handler: (context: AbilityContext) => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to place in a province',
                    context: context,
                    cards: context.player.dynastyDeck.slice(0, 3),
                    cardHandler: (cardFromDeck: BaseCard) => this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a card to replace with ' + cardFromDeck.name,
                        context: context,
                        cardType: [CardTypes.Holding, CardTypes.Character, CardTypes.Event],
                        location: Locations.Provinces,
                        controller: Players.Self,
                        onSelect: (player: Player, card: BaseCard) => {
                            this.game.addMessage('{0} discards {1}, replacing it with {2}', player, card, cardFromDeck);
                            player.moveCard(cardFromDeck, card.location);
                            cardFromDeck.facedown = false;
                            player.moveCard(card, Locations.DynastyDiscardPile);
                            player.shuffleDynastyDeck();
                            return true;
                        }
                    })
                });
            }
        });
    }
}


export default WalkingTheWay;
