import { CardType, Duration, Element, Location, Players, TargetMode } from '../../../Constants.js';
import type { Cost } from '../../../costs/Cost.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

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
            if(!context.game.actions.chosenDiscard().canAffect(context.player, context)) {
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
                                mode: TargetMode.Single,
                                numCards: 1,
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
                const discardAction = context.game.actions.discardCard({ target: context.costs.maelstromCost });
                const event = discardAction.getEvent(context.costs.maelstromCost, context);
                context.game.addMessage('{0} chooses to discard a card', context.player);
                return [event];
            }

            //this is a do-nothing event to allow you to opt out and not scuttle the event
            const noop = context.game.actions.handler({ handler: () => {} });
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
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    context.costs.maelstromCostPaid ? true : card.controller === context.player
            }, AbilityDsl.actions.multipleContext((context) => {
                const target = context.target;
                // "you" is whoever triggered this, which is not always the province's
                // controller (Contested Countryside). A delayed effect's own context is
                // owned by the source's controller, so capture the player here.
                const triggeringPlayer = context.player;
                return {
                    gameActions: [
                        AbilityDsl.actions.moveToConflict(),
                        AbilityDsl.actions.cardLastingEffect({
                            target: target,
                            duration: Duration.UntilEndOfPhase,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    afterConflict: (event) =>
                                        event.conflict.winner === target.controller &&
                                            target.isParticipating() &&
                                            target.controller === triggeringPlayer
                                },
                                message: '{0} is honored due to {1}\'s effect',
                                messageArgs: [target, context.source],
                                gameAction: AbilityDsl.actions.honor()
                            })
                        })
                    ]
                };
            }))
            .effect('move {0} into the conflict{1}', (context) =>
                context.target?.controller === context.player ? ['. It will be honored if it wins the conflict'] : [''])
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
