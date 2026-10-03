
import { CardType, Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { arrangeTopOfDeck } from '../arrangeTopOfDeck.js';

class MiyaLibrary extends DrawCard {
    static id = 'miya-library';

    setupCardAbilities() {
        this.action('Replace Miya Library for a faceup imperial character')
            .condition((context) => context.player.dynastyDeck.length > 0)
            .handler((context) => {
                const arrange = () => arrangeTopOfDeck(
                    context,
                    context.player.dynastyDeck.slice(0, 4),
                    'Select the card you would like to place on top of your dynasty deck',
                    (ordered) => context.player.dynastyDeck.splice(0, ordered.length, ...ordered)
                );
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'select an imperial character to replace miya library',
                    context: context,
                    cardCondition: (card) => card.hasTrait('imperial') && card.getType() === CardType.Character,
                    cards: context.player.dynastyDeck.slice(0, 4),
                    options: [{ text: 'Do not replace Miya Library', handler: arrange }],
                    cardHandler: (card) => {
                        context.player.moveCard(card, context.source.location);
                        card.facedown = false;
                        context.player.moveCard(context.source, Location.DynastyDeck);
                        arrange();
                    }
                });
            })
            .effect('search the top four cards of their dynasty deck for an Imperial character');
    }
}


export default MiyaLibrary;
