import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType, Players } from '../../Constants.js';

class KaiuForges extends DrawCard {
    static id = 'kaiu-forges';

    setupCardAbilities() {
        this.action('Choose a province')
            .target({
                location: Location.Provinces,
                controller: Players.Self,
                cardType: CardType.Province
            })
            .handler((context) => {
                const province = context.target;
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a holding to swap with a Kaiu Wall',
                    context: context,
                    cardCondition: (card) => card.getType() === CardType.Holding,
                    cards: context.player.dynastyDeck.slice(0, 10),
                    options: [
                        {
                            text: 'Take nothing',
                            handler: () => {
                                this.game.addMessage(msg`${context.player} takes nothing`);
                                context.player.shuffleDynastyDeck();
                                return true;
                            }
                        }
                    ],
                    cardHandler: (cardFromDeck) => {
                        const provinceLocation = province.location;
                        const cards = context.player.getDynastyCardsInProvince(provinceLocation);
                        if(cards.some((a) => a.getType() === CardType.Holding && a.hasTrait('kaiu-wall'))) {
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
                                    context.player.shuffleDynastyDeck();
                                    return true;
                                }
                            });
                        } else {
                            this.game.addMessage(msg`${context.player} cannot put a holding into play because there is no Kaiu Wall in the selected province`);
                            context.player.shuffleDynastyDeck();
                        }
                    }
                });
            })
            .chatText('look at the top ten cards of their dynasty deck');
    }
}


export default KaiuForges;
