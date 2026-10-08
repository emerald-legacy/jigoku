import { msg } from '../../GameChat.js';
import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class BreakingIn extends ProvinceCard {
    static id = 'breaking-in';

    setupCardAbilities() {
        this.reaction('Search for a character card')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .handler((context) => {
                return this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card:',
                    context: context,
                    cards: context.player.dynastyDeck.slice(0, 8).filter((card) => card.type === CardType.Character),
                    options: [
                        { text: 'Select nothing', handler: () => this.game.addMessage(msg`${context.player} selects nothing from their deck`) }
                    ],
                    cardHandler: (cardFromDeck) => {
                        if(cardFromDeck.hasTrait('cavalry')) {
                            return this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Choose a province',
                                context: context,
                                cardType: [CardType.Province],
                                location: Location.Provinces,
                                controller: Players.Self,
                                onSelect: (player, card) => {
                                    this.game.addMessage(msg`${context.player} places ${cardFromDeck} in ${card.facedown ? card.location : card}`);
                                    player.moveCard(cardFromDeck, card.location);
                                    cardFromDeck.facedown = false;
                                    player.shuffleDynastyDeck();
                                    return true;
                                }
                            });
                        }
                        context.player.moveCard(cardFromDeck, context.source.location);
                        cardFromDeck.facedown = false;
                        this.game.addMessage(msg`${context.player} places ${cardFromDeck} in ${context.source}`);
                        context.player.shuffleDynastyDeck();
                        return true;
                    }
                });
            })
            .chatText('choose a character to place in a province');
    }
}
