import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { Cost } from '../../../costs/Cost.js';
import type { MessageArgs } from '../../../GameChat.js';

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context: AbilityContext<this>) =>
                context.player.conflictDeck.length >=
        (context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('artisan')) ? 4 : 3),
            cost: [
                AbilityDsl.costs.reveal((context: AbilityContext) =>
                    context.player.conflictDeck.slice(
                        0, context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('artisan')) ? 4 : 3
                    )
                ),
                workInProgressCost()
            ],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: (context: AbilityContext<this>) => {
                let [matchingCards, cardsToDiscard] = (context.costs.reveal as DrawCard[]).reduce(
                    (acc: DrawCard[][], card: DrawCard) => {
                        if(card.type === context.costs.workInProgress && card.location === Location.ConflictDeck) {
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
                        context.player.moveCard(card, Location.ConflictDiscardPile);
                    }
                };
                const takeCardHandler = (card: DrawCard) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Location.Hand);
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

function workInProgressCost(): Cost {
    return {
        getActionName: () => 'workInProgress',
        getCostMessage: (): MessageArgs => ['naming {0}', []],
        canPay: () => true,
        resolve: (context: AbilityContext) => {
            const choices = [CardType.Attachment, CardType.Character, CardType.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map((choice) => {
                    return () => {
                        context.costs.workInProgress = choice;
                    };
                })
            });
        },
        pay: () => {}
    };
}
