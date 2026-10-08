import { msg } from '../../../GameChat.js';
import { CardType, Duration, Element, Location, Players } from '../../../Constants.js';
import type { Cost } from '../../../costs/Cost.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type DrawCard from '../../../DrawCard.js';
import { delayedEffect } from '../../../effects.js';
import {
    cardLastingEffect,
    chosenDiscard,
    discardCard,
    handler,
    honor,
    moveToConflict,
    multipleContext
} from '../../../GameActions/GameActions.js';

function maelstromCost(): Cost<{ maelstromCostPaid: boolean; maelstromCost: DrawCard }> {
    return {
        getActionName(_context) {
            return 'maelstromCost';
        },
        getCostMessage(context) {
            if(context.costs.maelstromCostPaid) {
                return ['discarding {0}'];
            }
            return [];
        },
        canPay() {
            return true;
        },
        resolve(context, result) {
            context.costs.maelstromCostPaid = false;
            if(!chosenDiscard().canAffect(context.player, context)) {
                return;
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Discard a card?',
                source: context.source,
                options: [
                    {
                        text: 'Yes',
                        handler: () => {
                            context.costs.maelstromCostPaid = true;
                            context.game.promptForSelect(context.player, {
                                activePromptTitle: 'Choose a card to discard',
                                context: context,
                                location: Location.Hand,
                                controller: Players.Self,
                                onSelect: (_player, card) => {
                                    if(card.isDrawCard()) {
                                        context.costs.maelstromCost = card;
                                    }
                                    return true;
                                },
                                onCancel: () => {
                                    result.cancelled = true;
                                    return true;
                                }
                            });
                        }
                    },
                    { text: 'No', handler: () => (context.costs.maelstromCostPaid = false) }
                ]
            });
        },
        payEvent(context) {
            if(context.costs.maelstromCostPaid) {
                const discardAction = discardCard({ target: context.costs.maelstromCost });
                const event = discardAction.getEvent(context.costs.maelstromCost, context);
                context.game.addMessage('{0} chooses to discard a card', context.player);
                return [event];
            }

            //this is a do-nothing event to allow you to opt out and not scuttle the event
            const noop = handler({ handler: () => {} });
            return noop.getEvent(context.player, context);
        },
        promptsPlayer: true
    };
}

const elementKey = 'maelstrom-water';

export default class Maelstrom extends ProvinceCard {
    static id = 'maelstrom';
    setupCardAbilities() {
        this.action('Move a character into the conflict')
            .cost(maelstromCost())
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    context.costs.maelstromCostPaid ? true : card.controller === context.player
            }, multipleContext((context) => {
                const target = context.target;
                // the triggering player, not always the controller (Contested Countryside)
                const triggeringPlayer = context.player;
                return {
                    gameActions: [
                        moveToConflict(),
                        cardLastingEffect({
                            target: target,
                            duration: Duration.UntilEndOfPhase,
                            effect: delayedEffect({
                                when: {
                                    afterConflict: (event) =>
                                        event.conflict.winner === target.controller &&
                                            target.isParticipating() &&
                                            target.controller === triggeringPlayer
                                },
                                message: () => msg`${target} is honored due to ${context.source}'s effect`,
                                gameAction: honor()
                            })
                        })
                    ]
                };
            }))
            .chatText('move {0} into the conflict{1}', (context) =>
                context.target.controller === context.player ? ['. It will be honored if it wins the conflict'] : [''])
            .conflictProvinceCondition((province) => province.isElement(this.getCurrentElementSymbol(elementKey)))
            .cannotTargetFirst();
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ability - Province Element',
            element: Element.Water
        });
        return symbols;
    }
}
