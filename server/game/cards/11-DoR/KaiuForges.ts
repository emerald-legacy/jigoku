import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, DeckType, Players, Trait } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { moveCard, placeInProvince, sequential } from '../../GameActions/GameActions.js';

class KaiuForges extends DrawCard {
    static id = 'kaiu-forges';

    override setupCardAbilities() {
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
                cardCondition: (card) => card.type === CardType.Holding,
                selectedCardsHandler: (context, _event, [cardFromDeck]) => this.swapWithKaiuWall(context, cardFromDeck)
            })
            .chatText('look at the top ten cards of their dynasty deck');
    }

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
        if(!cards.some((card) => card.type === CardType.Holding && card.isFaceup() && card.hasTrait(Trait.KaiuWall))) {
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
            cardCondition: (card) => cards.includes(card) && card.isFaceup() && card.hasTrait(Trait.KaiuWall),
            onSelect: (player, card) => {
                this.game.addMessage(msg`${player} chooses to replace ${card} with ${cardFromDeck}`);
                sequential([
                    placeInProvince({ target: cardFromDeck, destination: provinceLocation }),
                    moveCard({ target: card, destination: Location.DynastyDeck })
                ]).resolve(context.player, context);
                return true;
            }
        });
    }
}


export default KaiuForges;
