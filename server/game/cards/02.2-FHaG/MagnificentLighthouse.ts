import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { Location } from '../../Constants.js';

class MagnificentLighthouse extends DrawCard {
    static id = 'magnificent-lighthouse';

    setupCardAbilities() {
        this.action('Look at top 3 cards')
            .selectIf({
                activePromptTitle: 'Choose which deck to look at:'
            }, {
                'Dynasty Deck': (context) => !!context.player.opponent && context.player.opponent.dynastyDeck.length > 0,
                'Conflict Deck': (context) => !!context.player.opponent && context.player.opponent.conflictDeck.length > 0
            })
            .handler((context) => {
                const opponent = context.player.opponent;
                if(!opponent) {
                    return;
                }
                const topThree = (context.select === 'Dynasty Deck' ? opponent.dynastyDeck : opponent.conflictDeck).slice(0, 3);
                if(topThree.length > 0) {
                    this.chooseDiscard(context, opponent, topThree);
                }
            })
            .effect('look at the top 3 cards of {1}\'s {2}', (context) => [context.player.opponent, context.select.toLowerCase()]);
    }

    // With fewer than 3 cards, each step may be skipped, except the bottom card after skipping the discard of 2
    private chooseDiscard(context: AbilityContext, opponent: Player, cards: DrawCard[]) {
        const canSkip = cards.length < 3;
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to discard',
            context: context,
            cards: cards,
            cardHandler: (card) => {
                this.game.addMessage('{0} chooses to discard {1}', context.player, card);
                opponent.moveCard(card, card.isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
                this.chooseBottom(context, opponent, cards.filter((c) => c !== card), canSkip);
            },
            options: canSkip ? [{ text: 'None', handler: () => this.chooseBottom(context, opponent, cards, cards.length !== 2) }] : []
        });
    }

    private chooseBottom(context: AbilityContext, opponent: Player, cards: DrawCard[], canSkip: boolean) {
        if(cards.length === 0) {
            return;
        }
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to put on the bottom of the deck',
            context: context,
            cards: cards,
            cardHandler: (card) => {
                this.game.addMessage('{0} places a card on the bottom of the deck', context.player, card);
                opponent.moveCard(card, card.isDynasty ? Location.DynastyDeck : Location.ConflictDeck, { bottom: true });
            },
            options: canSkip ? [{ text: 'None', handler: () => true }] : []
        });
    }
}


export default MagnificentLighthouse;
