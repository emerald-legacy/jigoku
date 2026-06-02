import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType, Players } from '../../Constants.js';
import type Player from '../../Player.js';
import type BaseCard from '../../BaseCard.js';

class KaiuForges extends DrawCard {
    static id = 'kaiu-forges';

    setupCardAbilities() {
        this.action<ProvinceCard>({
            title: 'Choose a province',
            target: {
                location: Location.Provinces,
                controller: Players.Self,
                cardType: CardType.Province
            },
            effect: 'look at the top ten cards of their dynasty deck',
            handler: (context) => {
                const province = context.target;
                if(!province) {
                    return;
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a holding to swap with a Kaiu Wall',
                    context: context,
                    cardCondition: (card: BaseCard) => card.getType() === CardType.Holding,
                    cards: context.player.dynastyDeck.slice(0, 10),
                    choices: ['Take nothing'],
                    handlers: [() => {
                        this.game.addMessage('{0} takes nothing', context.player);
                        context.player.shuffleDynastyDeck();
                        return true;
                    }],
                    cardHandler: (cardFromDeck: DrawCard) => {
                        const provinceLocation = province.location;
                        const cards = context.player.getDynastyCardsInProvince(provinceLocation);
                        if(cards.some((a: BaseCard) => a.getType() === CardType.Holding && a.hasTrait('kaiu-wall'))) {
                            this.game.promptForSelect(context.player, {
                                activePrompt: 'Choose a Kaiu Wall to swap with',
                                cardType: CardType.Holding,
                                location: Location.Provinces,
                                controller: Players.Self,
                                context: context,
                                targets: false,
                                cardCondition: (card: DrawCard) => cards.includes(card) && card.hasTrait('kaiu-wall'),
                                onSelect: (player: Player, card: DrawCard) => {
                                    this.game.addMessage('{0} chooses to replace {1} with {2}', player, card, cardFromDeck);
                                    context.player.moveCard(cardFromDeck, provinceLocation);
                                    context.player.moveCard(card, Location.DynastyDeck);
                                    cardFromDeck.facedown = false;
                                    context.player.shuffleDynastyDeck();
                                    return true;
                                }
                            });
                        } else {
                            this.game.addMessage('{0} cannot put a holding into play because there is no Kaiu Wall in the selected province', context.player);
                            context.player.shuffleDynastyDeck();
                        }
                    }
                });
            }
        });
    }
}


export default KaiuForges;
