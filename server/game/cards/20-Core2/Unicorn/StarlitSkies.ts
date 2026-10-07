import type { AbilityContext } from '../../../AbilityContext.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class StarlitSkies extends DrawCard {
    static id = 'starlit-skies';

    setupCardAbilities() {
        this.action('Look at top 3 cards')
            .select({
                activePromptTitle: 'Choose which deck to look at:'
            }, {
                'Your Dynasty Deck': (context) => context.player.dynastyDeck.length > 0,
                'Your Conflict Deck': (context) => context.player.conflictDeck.length > 0
            })
            .handler((context) => {
                const deck = context.select === 'Your Dynasty Deck' ? context.player.dynastyDeck : context.player.conflictDeck;
                const topThree = deck.slice(0, 3);
                if(topThree.length === 0) {
                    return;
                }
                const isDynasty = topThree[0].isDynasty;
                this.chooseCard(context, 'Select a card to discard', topThree, 3, (card) => {
                    context.game.addMessage('{0} chooses to discard {1}', context.player, card);
                    context.player.moveCard(card, isDynasty ? Location.DynastyDiscardPile : Location.ConflictDiscardPile);
                }, (rest) => this.chooseCard(context, 'Select a card to put on the bottom of the deck', rest, 2, (card) => {
                    context.game.addMessage('{0} places a card on the bottom of the deck', context.player, card);
                    context.player.moveCard(card, isDynasty ? Location.DynastyDeck : Location.ConflictDeck, { bottom: true });
                }));
            })
            .effect((context) => msg`look at the top 3 cards of ${context.player}'s ${(context.select ?? '').toLowerCase()}`)
            .evenDuringDynasty();
    }

    /** Offers None while fewer than `noneBelow` cards are shown. */
    private chooseCard(context: AbilityContext, title: string, cards: DrawCard[], noneBelow: number, onChoose: (card: DrawCard) => void, next?: (rest: DrawCard[]) => void) {
        context.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: title,
            context: context,
            cards: cards,
            cardHandler: (card) => {
                onChoose(card);
                next?.(cards.filter((c) => c !== card));
            },
            options: cards.length < noneBelow ? [{ text: 'None', handler: () => next?.(cards) }] : []
        });
    }
}
