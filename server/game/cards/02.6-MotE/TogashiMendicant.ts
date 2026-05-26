import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';

class TogashiMendicant extends DrawCard {
    static id = 'togashi-mendicant';

    setupCardAbilities() {
        this.reaction({
            title: 'Rearrange top 3 cards of dynasty deck',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && context.player.dynastyDeck.length > 0
            },
            effect: 'rearrange the top 3 cards of their dynasty deck',
            handler: (context: any) => this.togashiMendicantPrompt(context, context.player.dynastyDeck.slice(0, 3), [], 'Which card do you want to be on top?')
        });
    }

    togashiMendicantPrompt(context: any, promptCards: any, orderedCards: any, promptTitle: any) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: any) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c: any) => c !== card);
                if(promptCards.length > 1) {
                    this.togashiMendicantPrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                } else if(promptCards.length === 1) {
                    orderedCards.push(promptCards[0]);
                }
                context.player.dynastyDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}


export default TogashiMendicant;
