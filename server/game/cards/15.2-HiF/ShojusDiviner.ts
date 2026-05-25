import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { AbilityTypes, Locations } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ShojusDiviner extends DrawCard {
    static id = 'shoju-s-diviner';

    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Divine your conflict deck',
                printedAbility: false,
                condition: (context: AbilityContext) => context.player.conflictDeck.length > 0,
                effect: 'look at the top 8 cards of their conflict deck',
                gameAction: AbilityDsl.actions.handler({
                    handler: (context: AbilityContext) => {
                        const cards = context.player.conflictDeck.slice(0, 8);
                        const chosenCards: DrawCard[] = [];

                        this.selectPrompt(context, cards, chosenCards);
                    }
                })
            })
        });
    }

    selectPrompt(context: AbilityContext, cards: DrawCard[], chosenCards: DrawCard[]) {
        if(!cards || cards.length <= 0) {
            return;
        }

        const cardHandler = (currentCard: DrawCard) => {
            cards = cards.filter((a: DrawCard) => a !== currentCard);
            chosenCards.push(currentCard);
            this.promptWithMenu(context, cards, chosenCards, cardHandler);
        };

        this.promptWithMenu(context, cards, chosenCards, cardHandler);

    }

    promptWithMenu(context: AbilityContext, cards: DrawCard[], chosenCards: DrawCard[], cardHandler: (card: DrawCard) => void) {
        if(!cards || cards.length <= 0) {
            this.handleCards(context, cards, chosenCards);
            return;
        }

        let promptInfo = 'on top of your deck';
        if(chosenCards.length > 0) {
            promptInfo = `under ${chosenCards[chosenCards.length - 1].name}`;
        }
        const prompt = `Select the card to put ${promptInfo}`;

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: prompt,
            context: context,
            cards: cards,
            cardHandler: cardHandler,
            choices: ['Discard the rest'],
            handlers: [() => {
                this.handleCards(context, cards, chosenCards);
            }]
        });
    }

    handleCards(context: AbilityContext, cards: DrawCard[], chosenCards: DrawCard[]) {
        if(cards && cards.length > 0) {
            this.game.addMessage('{0} discards {1}', context.player, cards);
            cards.forEach((card: DrawCard) => context.player.moveCard(card, Locations.ConflictDiscardPile));
        }
        if(chosenCards.length > 0) {
            this.game.addMessage('{0} places {1} card{2} on top of their deck', context.player, chosenCards.length, chosenCards.length > 1 ? 's' : '');
            context.player.conflictDeck.splice(0, chosenCards.length, ...chosenCards);
        }
    }
}


export default ShojusDiviner;
