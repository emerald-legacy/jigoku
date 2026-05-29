import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../basecard.js';
import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Locations, CardTypes } from '../../Constants.js';

const testOfSkillCost = function() {
    return {
        action: { name: 'testOfSkillCost', getCostMessage: () => ['naming {0}', []] as [string, unknown[]] },
        canPay: function() {
            return true;
        },
        resolve: function(context: AbilityContext, result: { resolved: boolean; value?: boolean } = { resolved: false }) {
            let choices = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map((choice) => {
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
                const isMatching = (card: BaseCard) => card.type === context.costs.testOfSkillCost && card.location === Locations.ConflictDeck;
                let matchingCards: BaseCard[] = (context.costs.reveal as BaseCard[]).filter(isMatching);
                let cardsToDiscard: BaseCard[] = (context.costs.reveal as BaseCard[]).filter((card: BaseCard) => !isMatching(card));
                matchingCards = matchingCards.filter((c: BaseCard) => c.uuid !== context.source.uuid);

                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    cardsToDiscard.forEach((card: BaseCard) => {
                        context.player.moveCard(card, Locations.ConflictDiscardPile);
                    });
                };
                let takeCardHandler = (card: BaseCard) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Locations.Hand);
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
