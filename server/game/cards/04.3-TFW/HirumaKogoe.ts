import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';

class HirumaKogoe extends DrawCard {
    static id = 'hiruma-kogoe';

    setupCardAbilities() {
        this.reaction('Rearrange top 3 cards of your conflict deck')
            .when({
                onPhaseStarted: (event, context) => event.phase === 'draw' && context.player.opponent && context.player.honor < context.player.opponent.honor
            })
            .handler((context) => {
                this.hirumaKogoePrompt(context, context.player.conflictDeck.slice(0, 3), [], 'Which card do you want to be on top?');
            })
            .effect('rearrange the top 3 cards of their conflict deck');
    }

    hirumaKogoePrompt(context: AbilityContext, promptCards: DrawCard[], orderedCards: DrawCard[], promptTitle: string) {
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cards: promptCards,
            cardHandler: (card: DrawCard) => {
                orderedCards.push(card);
                promptCards = promptCards.filter((c) => c !== card);
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
