import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import type { Cost } from '../../costs/Cost.js';
import type { MessageArgs } from '../../GameChat.js';

const testOfSkillCost = function(): Cost {
    return {
        getActionName: () => 'testOfSkillCost',
        getCostMessage: (): MessageArgs => ['naming {0}', []],
        canPay: function() {
            return true;
        },
        resolve: function(context: AbilityContext) {
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
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context: AbilityContext) => context.player.conflictDeck.length >= (context.player.cardsInPlay.some((card: BaseCard) => card.hasTrait('duelist')) ? 4 : 3),
            cost: [ability.costs.reveal((context: AbilityContext) => context.player.conflictDeck.slice(0,
                context.player.cardsInPlay.some((card: BaseCard) => card.hasTrait('duelist')) ? 4 : 3
            )), testOfSkillCost()],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: (context: AbilityContext) => {
                const isMatching = (card: BaseCard) => card.type === context.costs.testOfSkillCost && card.location === Location.ConflictDeck;
                let matchingCards: BaseCard[] = (context.costs.reveal as BaseCard[]).filter(isMatching);
                let cardsToDiscard: BaseCard[] = (context.costs.reveal as BaseCard[]).filter((card: BaseCard) => !isMatching(card));
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
            }
        });
    }
}


export default TestOfSkill;
