import { msg } from '../../GameChat.js';
import { Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class MiyaSatoshi extends DrawCard {
    static id = 'miya-satoshi';

    setupCardAbilities() {
        this.action('Discard dynasty cards until you find an Imperial')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .handler((context) => {
                const firstImperial = context.player.dynastyDeck.find((card) => card.hasTrait('imperial'));
                if(!firstImperial) {
                    this.game.addMessage(msg`${context.player} discards their entire dynasty deck: ${context.player.dynastyDeck.slice()}`);
                    context.player.dynastyDeck.forEach((card) => context.player.moveCard(card, Location.DynastyDiscardPile));
                    return;
                }
                const index = context.player.dynastyDeck.indexOf(firstImperial);
                const discardedCards = context.player.dynastyDeck.slice(0, index + 1);
                this.game.addMessage(msg`${context.player} discards ${discardedCards} while searching for an Imperial card`);
                discardedCards.forEach((card) => context.player.moveCard(card, Location.DynastyDiscardPile));
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to discard',
                    context: context,
                    location: Location.Provinces,
                    controller: Players.Self,
                    cardCondition: (card) => card.isDynasty && card.location !== Location.StrongholdProvince,
                    onSelect: (player, card) => {
                        this.game.addMessage(msg`${player} chooses to discard ${card}, and puts ${firstImperial} faceup in its place`);
                        context.player.moveCard(firstImperial, card.location);
                        firstImperial.facedown = false;
                        context.player.moveCard(card, Location.DynastyDiscardPile);
                        return true;
                    }
                });
            })
            .chatText('search for an Imperial card and place it in a province');
    }
}


export default MiyaSatoshi;
