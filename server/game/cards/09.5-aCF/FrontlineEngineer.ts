import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { modifyGlory } from '../../effects.js';
import { handler } from '../../GameActions/GameActions.js';

class FrontlineEngineer extends DrawCard {
    static id = 'frontline-engineer';

    setupCardAbilities() {
        this.persistentEffect({
            effect: modifyGlory(() => this.getHoldingsInPlay())
        });

        this.action('Place a holding from your deck faceup in the defending province')
            .condition(context => context.player.dynastyDeck.length > 0 && context.source.isDefending())
            .selectCard({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince(),
                gameAction: handler({
                    handler: (context, [province]) => this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Choose a holding',
                        context: context,
                        cardCondition: (card) => card.getType() === CardType.Holding,
                        cards: context.player.dynastyDeck.slice(0, 5),
                        options: [
                            {
                                text: 'Take nothing',
                                handler: () => {
                                    this.game.addMessage('{0} takes nothing', context.player);
                                    context.player.shuffleDynastyDeck();
                                    return true;
                                }
                            }
                        ],
                        cardHandler: (cardFromDeck) => {
                            if(!province?.isCard()) {
                                return;
                            }
                            const cards = context.player.getDynastyCardsInProvince(province.location);
                            this.game.addMessage('{0} discards {1}, replacing it with {2}', context.player, cards, cardFromDeck);
                            context.player.moveCard(cardFromDeck, province.location);
                            cardFromDeck.facedown = false;
                            cards.forEach(element => {
                                context.player.moveCard(element, Location.DynastyDiscardPile);
                            });
                            context.player.shuffleDynastyDeck();
                        }
                    })
                })
            })
            .chatText('look at the top five cards of their dynasty deck');
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
