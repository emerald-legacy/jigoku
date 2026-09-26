import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';
import type { MessageArgs } from '../../GameChat.js';

const testOfSkillCost = function(): Cost<{ testOfSkillCost: CardType }> {
    return {
        getActionName: () => 'testOfSkillCost',
        getCostMessage: (): MessageArgs => ['naming {0}', []],
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            const choices = [CardType.Attachment, CardType.Character, CardType.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map((choice) => {
                    return () => {
                        context.costs.testOfSkillCost = choice;
                    };
                })
            });
        },
        pay: function() {
        }
    };

};

class TestOfSkill extends DrawCard {
    static id = 'test-of-skill';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Reveal cards and take ones matching named type')
            .cost(ability.costs.reveal((context: AbilityContext) => context.player.conflictDeck.slice(0,
                context.player.cardsInPlay.some((card: BaseCard) => card.hasTrait('duelist')) ? 4 : 3
            )))
            .cost(testOfSkillCost())
            .condition((context) => context.player.conflictDeck.length >= (context.player.cardsInPlay.some((card: BaseCard) => card.hasTrait('duelist')) ? 4 : 3))
            .handler((context) => {
                const isMatching = (card: BaseCard) => card.type === context.costs.testOfSkillCost && card.location === Location.ConflictDeck;
                let matchingCards: BaseCard[] = (context.costs.reveal ?? []).filter(isMatching);
                let cardsToDiscard: BaseCard[] = (context.costs.reveal ?? []).filter((card: BaseCard) => !isMatching(card));
                matchingCards = matchingCards.filter((c: BaseCard) => c.uuid !== context.source.uuid);

                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    cardsToDiscard.forEach((card: BaseCard) => {
                        context.player.moveCard(card, Location.ConflictDiscardPile);
                    });
                };
                let takeCardHandler = (card: BaseCard) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Location.Hand);
                    return matchingCards.filter((c: BaseCard) => c.uuid !== card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: (card: BaseCard) => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card',
                            context: context,
                            cards: matchingCards,
                            cardHandler: (card: BaseCard) => {
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
            })
            .effect('take cards into their hand')
            .cannotBeMirrored();
    }
}


export default TestOfSkill;
