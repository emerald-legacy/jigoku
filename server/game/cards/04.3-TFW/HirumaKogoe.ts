import DrawCard from '../../DrawCard.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    setupCardAbilities() {
        this.reaction({
            title: 'Rearrange top 3 cards of your conflict deck',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'draw' && context.player.opponent && context.player.honor < context.player.opponent.honor
            },
            effect: 'rearrange the top 3 cards of their conflict deck',
            handler: (context) => {
                this.hirumaKogoePrompt(context, context.player.conflictDeck.slice(0, 3), [], 'Which card do you want to be on top?');
            }
        });
    }

    hirumaKogoePrompt(context: any, promptCards: any, orderedCards: any, promptTitle: any) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: any) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c: any) => c !== card);
                if(promptCards.length > 1) {
                    this.hirumaKogoePrompt(context, promptCards, orderedCards, 'Which card do you want to be the second card?');
                    return;
                }
                orderedCards.push(promptCards[0]);
                context.player.conflictDeck.splice(0, 3, ...orderedCards);
            }
        });
    }
}


export default HirumaKogoe;
