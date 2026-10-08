import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';

class ShrineMaiden extends DrawCard {
    static id = 'shrine-maiden';

    setupCardAbilities() {
        this.reaction('Reveal your top 3 conflict cards')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .cost(costs.revealCardsOf((context) => context.player.conflictDeck.slice(0, 3)))
            .handler((context) => {
                const cards = context.player.conflictDeck.slice(0, 3);
                const toHand = cards.filter((card) => card.hasTrait('kiho') || card.hasTrait('spell'));
                const toDiscard = cards.filter((card) => !card.hasTrait('kiho') && !card.hasTrait('spell'));

                toHand.forEach((card) => {
                    context.player.moveCard(card, Location.Hand);
                });

                toDiscard.forEach((card) => {
                    context.player.moveCard(card, Location.ConflictDiscardPile);
                });

                if(toHand.length && toDiscard.length) {
                    this.game.addMessage('{0} adds {1} to their hand and discards {2}', context.player, toHand, toDiscard);
                } else if(toHand.length) {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, toHand);
                } else {
                    this.game.addMessage('{0} discards {1}', context.player, toDiscard);
                }
            })
            .effect('take any revealed spells into their hand');
    }
}


export default ShrineMaiden;
