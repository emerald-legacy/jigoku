const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');

const testOfSkillCost = function() {
    return {
        action: { name: 'testOfSkillCost', getCostMessage: () => ['naming {0}', []] },
        canPay: function() {
            return true;
        },
        resolve: function(context, result = { resolved: false }) {
            let choices = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map(choice => {
                    return () => {
                        context.costs.testOfSkillCost = choice;
                        result.value = true;
                        result.resolved = true;
                    };
                })
            });
            return result;
        },
        pay: function() {
        }
    };

};

class TestOfSkill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: context => context.player.conflictDeck.size() >= (context.player.cardsInPlay.some(card => card.hasTrait('duelist')) ? 4 : 3),
            cost: [ability.costs.reveal(context => context.player.conflictDeck.first(
                context.player.cardsInPlay.some(card => card.hasTrait('duelist')) ? 4 : 3
            )), testOfSkillCost()],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: context => {
                const isMatching = card => card.type === context.costs.testOfSkillCost && card.location === Locations.ConflictDeck;
                let matchingCards = context.costs.reveal.filter(isMatching);
                let cardsToDiscard = context.costs.reveal.filter(card => !isMatching(card));
                //Handle situations where card is played from deck, such as with pillow book
                matchingCards = matchingCards.filter(c => c.uuid !== context.source.uuid);

                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    cardsToDiscard.forEach(card => {
                        context.player.moveCard(card, Locations.ConflictDiscardPile);
                    });
                };
                let takeCardHandler = card => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Locations.Hand);
                    return matchingCards.filter(c => c.uuid !== card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: card => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card',
                            context: context,
                            cards: matchingCards,
                            cardHandler: card => {
                                matchingCards = takeCardHandler(card);
                                discardHandler();
                            },
                            choices: ['Done'],
                            handlers: [discardHandler]
                        });
                    },
                    choices: ['Done'],
                    handlers: [discardHandler]
                });
            }
        });
    }
}

TestOfSkill.id = 'test-of-skill';

module.exports = TestOfSkill;
