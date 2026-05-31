import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Locations } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context: AbilityContext<this>) =>
                context.player.conflictDeck.length >=
        (context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('artisan')) ? 4 : 3),
            cost: [
                AbilityDsl.costs.reveal((context: AbilityContext<this>) =>
                    context.player.conflictDeck.slice(
                        0, context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('artisan')) ? 4 : 3
                    )
                ),
                testOfSkillCost()
            ],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: (context: AbilityContext<this>) => {
                let [matchingCards, cardsToDiscard] = (context.costs.reveal as DrawCard[]).reduce(
                    (acc: DrawCard[][], card: DrawCard) => {
                        if(card.type === context.costs.testOfSkillCost && card.location === Locations.ConflictDeck) {
                            acc[0].push(card);
                        } else {
                            acc[1].push(card);
                        }
                        return acc;
                    },
                    [[] as DrawCard[], [] as DrawCard[]]
                );
                matchingCards = matchingCards.filter((c: DrawCard) => c.uuid !== context.source.uuid);

                const discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    for(const card of cardsToDiscard) {
                        context.player.moveCard(card, Locations.ConflictDiscardPile);
                    }
                };
                const takeCardHandler = (card: DrawCard) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Locations.Hand);
                    return matchingCards.filter((c: DrawCard) => c.uuid !== card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: (card: DrawCard) => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card',
                            context: context,
                            cards: matchingCards,
                            cardHandler: (card: DrawCard) => {
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

function testOfSkillCost() {
    return {
        action: { name: 'testOfSkillCost', getCostMessage: (): [string, unknown[]] => ['naming {0}', []] },
        canPay: () => true,
        resolve: (context: AbilityContext, result: { resolved: boolean; value?: boolean } = { resolved: false }) => {
            const choices = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event];
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
        pay: () => {}
    };
}
