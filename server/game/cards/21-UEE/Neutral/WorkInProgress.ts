import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations } from '../../../Constants';
import { Cost } from '../../../Costs';
import DrawCard from '../../../drawcard';

function testOfSkillCost(): Cost {
    return {
        // @ts-ignore
        action: { name: 'testOfSkillCost', getCostMessage: () => ['naming {0}', []] },
        canPay() {
            return true;
        },
        resolve(context, result: any = { resolved: false }) {
            let choices = [CardTypes.Attachment, CardTypes.Character, CardTypes.Event];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: choices.map((choice) => () => {
                    context.costs.testOfSkillCost = choice;
                    result.value = true;
                    result.resolved = true;
                })
            });
            return result;
        },
        pay() {}
    };
}

export default class WorkInProgress extends DrawCard {
    static id = 'work-in-progress';

    setupCardAbilities() {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: (context) => context.player.conflictDeck.size() >= 3,
            cost: [AbilityDsl.costs.reveal((context) => context.player.conflictDeck.first(3)), testOfSkillCost()],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: (context) => {
                let matchingCards: DrawCard[] = [];
                let cardsToDiscard: DrawCard[] = [];
                for (const card of context.costs.reveal) {
                    if (card.type === context.costs.testOfSkillCost && card.location === Locations.ConflictDeck) {
                        if (card.uuid === context.source.uuid) {
                            //Handle situations where card is played from deck, such as with pillow book
                            matchingCards.push(card);
                        }
                    } else {
                        cardsToDiscard.push(card);
                    }
                }

                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    for (const card of cardsToDiscard) context.player.moveCard(card, Locations.ConflictDiscardPile);
                };
                let takeCardHandler = (card) => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, Locations.Hand);
                    return matchingCards.filter((c) => c.uuid !== card.uuid);
                };
                if (matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: (card) => {
                        matchingCards = takeCardHandler(card);
                        if (matchingCards.length === 0) return discardHandler();

                        if (context.player.isCharacterTraitInPlay('artisan')) {
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
                        }
                    },
                    choices: ['Done'],
                    handlers: [discardHandler]
                });
            }
        });
    }
}
