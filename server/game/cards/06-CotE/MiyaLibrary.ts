
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, Location } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';

class MiyaLibrary extends DrawCard {
    static id = 'miya-library';

    setupCardAbilities() {
        this.action({
            title: 'Replace Miya Library for a faceup imperial character',
            condition: (context: AbilityContext) => context.player.dynastyDeck.length > 0,
            effect: 'Search the top four card for your dynasty deck for an imperial character',
            handler: (context: AbilityContext) => {
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'select an imperial character to replace miya library',
                    context: context,
                    cardCondition: (card: DrawCard) => card.hasTrait('imperial') && card.getType() === CardType.Character,
                    cards: context.player.dynastyDeck.slice(0, 4),
                    choices: ['Do not replace Miya Library'],
                    handlers: [() => this.miyaLibraryPrompt(context, context.player.dynastyDeck.slice(0, 4), [], 'Select the card you would like to place on top of your dynasty deck')],
                    cardHandler: (card: DrawCard) => {
                        if(card.hasTrait('imperial') && card.getType() === CardType.Character) {
                            context.player.moveCard(card, context.source.location);
                            card.facedown = false;
                            context.player.moveCard(context.source, Location.DynastyDeck);
                        }
                        this.miyaLibraryPrompt(context, context.player.dynastyDeck.slice(0, 4), [], 'Select the card you would like to place on top of your dynasty deck');
                    }
                });
            }
        });
    }

    miyaLibraryPrompt(context: AbilityContext, promptCards: DrawCard[], orderedCards: DrawCard[], promptTitle: string) {
        const orderPrompt = ['first', 'second', 'third'];
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: DrawCard) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c: DrawCard) => c !== card);
                if(promptCards.length > 1) {
                    this.miyaLibraryPrompt(context, promptCards, orderedCards, 'Which card do you want to be the ' + orderPrompt[orderedCards.length] + ' card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.push(promptCards[0]);
                }
                context.player.dynastyDeck.splice(0, orderedCards.length, ...orderedCards);
            }
        });
    }
}


export default MiyaLibrary;
