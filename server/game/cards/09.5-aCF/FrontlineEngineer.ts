import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, DeckType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { deckSearch, handler } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { GameActionTarget } from '../../GameActions/GameAction.js';

class FrontlineEngineer extends DrawCard {
    static id = 'frontline-engineer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory(() => this.getHoldingsInPlay())
        });

        this.action('Place a holding from your deck faceup in the defending province')
            .condition((context) => context.player.dynastyDeck.length > 0 && context.source.isDefending())
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card) => card.isConflictProvince(),
                gameAction: handler({
                    handler: (context, [province]) => deckSearch({
                        activePromptTitle: 'Choose a holding',
                        cardsToLookAt: 5,
                        deck: DeckType.Dynasty,
                        cardCondition: (card) => card.getType() === CardType.Holding,
                        selectedCardsHandler: (context, _event, [cardFromDeck]) => this.replaceProvinceCards(context, province, cardFromDeck)
                    }).resolve(context.player, context)
                })
            })
            .chatText('look at the top five cards of their dynasty deck');
    }

    /** The holding replaces the dynasty cards in the province, which are discarded; the deck search shuffles afterwards. */
    private replaceProvinceCards(context: AbilityContext, province: GameActionTarget | undefined, cardFromDeck: DrawCard | undefined): void {
        if(!cardFromDeck) {
            this.game.addMessage(msg`${context.player} takes nothing`);
            return;
        }
        if(!province?.isCard()) {
            return;
        }
        const cards = context.player.getDynastyCardsInProvince(province.location);
        this.game.addMessage(msg`${context.player} discards ${cards}, replacing it with ${cardFromDeck}`);
        context.player.moveCard(cardFromDeck, province.location);
        cardFromDeck.facedown = false;
        cards.forEach((element) => {
            context.player.moveCard(element, Location.DynastyDiscardPile);
        });
    }

    getHoldingsInPlay() {
        return this.game.allCards.reduce((sum, card) => {
            if(card.isFaceup() && (card.isInProvince() && card.type === CardType.Holding)) {
                return sum + 1;
            }
            return sum;
        }, 0);
    }
}


export default FrontlineEngineer;
