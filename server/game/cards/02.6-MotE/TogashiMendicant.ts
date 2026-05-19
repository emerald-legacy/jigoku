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
            handler: context => this.togashiMendicantPrompt(context, context.player.dynastyDeck.slice(0, 3), [], 'Which card do you want to be on top?')
        });
    }

    togashiMendicantPrompt(context, promptCards, orderedCards, promptTitle) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: card => {
                orderedCards.push(card);
                promptCards = promptCards.filter(c => c !== card);
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
