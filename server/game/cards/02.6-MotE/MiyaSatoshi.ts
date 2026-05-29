import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { Locations, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

class MiyaSatoshi extends DrawCard {
    static id = 'miya-satoshi';

    setupCardAbilities() {
        this.action({
            title: 'Discard dynasty cards until you find an Imperial',
            condition: (context: AbilityContext) => context.player.dynastyDeck.length > 0,
            effect: 'search for an Imperial card and place it in a province',
            handler: (context: any) => {
                const firstImperial = context.player.dynastyDeck.find((card: DrawCard) => card.hasTrait('imperial'));
                if(!firstImperial) {
                    this.game.addMessage('{0} discards their entire dynasty deck: {1}', context.player, context.player.dynastyDeck.slice());
                    context.player.dynastyDeck.forEach((card: DrawCard) => context.player.moveCard(card, Locations.DynastyDiscardPile));
                    return;
                }
                const index = context.player.dynastyDeck.indexOf(firstImperial);
                const discardedCards = context.player.dynastyDeck.slice(0, index + 1);
                this.game.addMessage('{0} discards {1} while searching for an Imperial card', context.player, discardedCards);
                discardedCards.forEach((card: DrawCard) => context.player.moveCard(card, Locations.DynastyDiscardPile));
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Choose a card to discard',
                    context: context,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: (card: BaseCard) => card.isDynasty,
                    onSelect: (player: Player, card: BaseCard) => {
                        this.game.addMessage('{0} chooses to discard {1}, and puts {2} faceup in its place', player, card, firstImperial);
                        context.player.moveCard(firstImperial, card.location);
                        firstImperial.facedown = false;
                        context.player.moveCard(card, Locations.DynastyDiscardPile);
                        return true;
                    }
                });
            }
        });
    }
}


export default MiyaSatoshi;
