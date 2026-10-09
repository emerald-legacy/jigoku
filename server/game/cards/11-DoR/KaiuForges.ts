import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, DeckType, Players } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class KaiuForges extends DrawCard {
    static id = 'kaiu-forges';

    setupCardAbilities() {
        this.action('Choose a province')
            .target({
                location: Location.Provinces,
                controller: Players.Self,
                cardType: CardType.Province
            })
            .deckSearch({
                activePromptTitle: 'Choose a holding to swap with a Kaiu Wall',
                cardsToLookAt: 10,
                deck: DeckType.Dynasty,
                cardCondition: (card) => card.getType() === CardType.Holding,
                selectedCardsHandler: (context, _event, [cardFromDeck]) => this.swapWithKaiuWall(context, cardFromDeck)
            })
            .chatText('look at the top ten cards of their dynasty deck');
    }

    /** The holding goes into the chosen province and a Kaiu Wall there into the deck; the deck search shuffles afterwards. */
    private swapWithKaiuWall(context: AbilityContext, cardFromDeck: DrawCard | undefined): void {
        if(!cardFromDeck) {
            this.game.addMessage(msg`${context.player} takes nothing`);
            return;
        }
        if(!context.target) {
            return;
        }
        const provinceLocation = context.target.location;
        const cards = context.player.getDynastyCardsInProvince(provinceLocation);
        if(!cards.some((card) => card.getType() === CardType.Holding && card.hasTrait('kaiu-wall'))) {
            this.game.addMessage(msg`${context.player} cannot put a holding into play because there is no Kaiu Wall in the selected province`);
            return;
        }
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a Kaiu Wall to swap with',
            cardType: CardType.Holding,
            location: Location.Provinces,
            controller: Players.Self,
            context: context,
            targets: false,
            cardCondition: (card) => cards.includes(card) && card.hasTrait('kaiu-wall'),
            onSelect: (player, card) => {
                this.game.addMessage(msg`${player} chooses to replace ${card} with ${cardFromDeck}`);
                context.player.moveCard(cardFromDeck, provinceLocation);
                context.player.moveCard(card, Location.DynastyDeck);
                cardFromDeck.facedown = false;
                return true;
            }
        });
    }
}


export default KaiuForges;
