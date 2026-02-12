import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context) =>
                context.player.conflictDeck.size() >=
        (context.player.cardsInPlay.some((card) => card.hasTrait('artisan')) ? 4 : 3),
            cost: [
                AbilityDsl.costs.reveal((context) =>
                    context.player.conflictDeck.first(
                        context.player.cardsInPlay.some((card) => card.hasTrait('artisan')) ? 4 : 3
                    )
                ),
                testOfSkillCost()
            ],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: (context) => {
                let [matchingCards, cardsToDiscard] = context.costs.reveal.reduce(
                    (acc, card) => {
                        if(card.type === context.costs.testOfSkillCost && card.location === Locations.ConflictDeck) {
                            acc[0].push(card);
                        } else {
                            acc[1].push(card);
                        }
                        return acc;
                    },
                    [[], []]
                );
                //Handle situations where card is played from deck, such as with pillow book
                matchingCards = matchingCards.filter((c) => c.uuid !== context.source.uuid);

                const discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    for(const card of cardsToDiscard) {
                        context.player.moveCard(card, Locations.ConflictDiscardPile);
                    }
                };
                const takeCardHandler = (card) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Locations.Hand);
                    return matchingCards.filter((c) => c.uuid !== card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: (card) => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card',
                            context: context,
                            cards: matchingCards,
                            cardHandler: (card) => {
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
        action: { name: 'testOfSkillCost', getCostMessage: () => ['naming {0}', []] },
        canPay: () => true,
        resolve: (context, result = { resolved: false }) => {
            const choices = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map((choice) => {
                    return () => {
                        context.costs.testOfSkillCost = choice;
                        // @ts-expect-error -- result.value is not declared on the type but is used by the cost resolution system
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
