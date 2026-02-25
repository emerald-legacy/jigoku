const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class ShrineMaiden extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal your top 3 conflict cards',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            cost: ability.costs.reveal(context => context.player.conflictDeck.first(3)),
            effect: 'take any revealed spells into their hand',
            handler: context => {
                const cards = context.player.conflictDeck.first(3);
                const toHand = cards.filter(card => card.hasTrait('kiho') || card.hasTrait('spell'));
                const toDiscard = cards.filter(card => !card.hasTrait('kiho') && !card.hasTrait('spell'));

                toHand.forEach(card => {
                    context.player.moveCard(card, Locations.Hand);
                });

                toDiscard.forEach(card => {
                    context.player.moveCard(card, Locations.ConflictDiscardPile);
                });

                if(toHand.length && toDiscard.length) {
                    this.game.addMessage('{0} adds {1} to their hand and discards {2}', context.player, toHand, toDiscard);
                } else if(toHand.length) {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, toHand);
                } else {
                    this.game.addMessage('{0} discards {1}', context.player, toDiscard);
                }
            }
        });
    }
}

ShrineMaiden.id = 'shrine-maiden';

module.exports = ShrineMaiden;
