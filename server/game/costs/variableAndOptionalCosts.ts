import { Location, Players, PlayType, TargetMode } from '../Constants.js';
import { Event } from '../Events/Event.js';
import { HandlerAction } from '../GameActions/HandlerAction.js';
import { Derivable, derive } from '../utils/helpers.js';
import type { AbilityContext } from '../AbilityContext.js';
import { TriggeredAbilityContext } from '../TriggeredAbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import type { Cost, Result } from './Cost.js';

export function returnRings(amount = -1, ringCondition = (_ring: Ring, _context: TriggeredAbilityContext) => true): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            for(const ring of Object.values(context.game.rings)) {
                if(ring.claimedBy === context.player.name && ringCondition(ring, context)) {
                    return true;
                }
            }
            return false;
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'returnRing';
        },
        getCostMessage(context: TriggeredAbilityContext) {
            return ['returning the {1}', [context.costs.returnRing]];
        },
        resolve(context: TriggeredAbilityContext, result) {
            const chosenRings: Ring[] = [];
            const promptPlayer = () => {
                const buttons: Array<{ text: string; arg: string }> = [];
                if(chosenRings.length > 0) {
                    buttons.push({ text: 'Done', arg: 'done' });
                }
                if(result.canCancel) {
                    buttons.push({ text: 'Cancel', arg: 'cancel' });
                }
                context.game.promptForRingSelect(context.player, {
                    activePromptTitle: 'Choose a ring to return',
                    context: context,
                    buttons: buttons,
                    ringCondition: (ring: Ring) =>
                        ringCondition(ring, context) &&
                        ring.claimedBy === context.player.name &&
                        !chosenRings.includes(ring),
                    onSelect: (player: Player, ring: Ring) => {
                        chosenRings.push(ring);
                        if(
                            Object.values(context.game.rings).some(
                                (ring: Ring) =>
                                    ring.claimedBy === context.player.name &&
                                    !chosenRings.includes(ring) &&
                                    (amount < 0 || chosenRings.length < amount)
                            )
                        ) {
                            promptPlayer();
                        } else {
                            context.costs.returnRing = chosenRings;
                        }
                        return true;
                    },
                    onMenuCommand: (player: Player, arg: string): boolean | undefined => {
                        if(arg === 'done') {
                            context.costs.returnRing = chosenRings;
                            return true;
                        }
                        return undefined;
                    },
                    onCancel: () => {
                        context.costs.returnRing = [];
                        result.cancelled = true;
                    }
                });
            };
            promptPlayer();
        },
        payEvent(context: TriggeredAbilityContext) {
            return context.game.actions.returnRing({ target: context.costs.returnRing as Ring }).getEventArray(context);
        }
    };
}

export function chooseFate(type: PlayType): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: TriggeredAbilityContext & { chooseFate: number }, result: Result) {
            context.chooseFate = 0;

            let extrafate = context.player.fate - context.player.getReducedCost(type, context.source);
            if(!context.player.checkRestrictions('placeFateWhenPlayingCharacter', context)) {
                extrafate = 0;
            }
            if(
                !context.player.checkRestrictions('placeFateWhenPlayingCharacterFromProvince', context) &&
                type === PlayType.PlayFromProvince
            ) {
                extrafate = 0;
            }
            if(!context.player.checkRestrictions('spendFate', context)) {
                extrafate = 0;
            }

            let max = 3;
            let opts: Array<{ choice: string; handler: () => void }> = [];
            for(let i = 0; i <= Math.min(extrafate, max); i++) {
                opts.push({
                    choice: i.toString(),
                    handler: () => {
                        context.chooseFate += i;
                    }
                });
            }

            if(extrafate > max) {
                opts[3] = {
                    choice: 'More',
                    handler: () => {
                        max += 3;
                        context.chooseFate += 3;

                        opts = opts
                            .filter((o) => {
                                if(o.choice === 'Cancel') {
                                    return true;
                                }
                                if(o.choice === 'More') {
                                    return extrafate >= max;
                                }
                                return extrafate >= parseInt(o.choice, 10) + 3;
                            })
                            .map((o) => ({
                                choice:
                                    o.choice === 'Cancel' || o.choice === 'More'
                                        ? o.choice
                                        : (parseInt(o.choice, 10) + 3).toString(),
                                handler: o.handler
                            }));
                        context.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Choose additional fate',
                            waitingPromptTitle: 'Waiting for opponent to take an action or pass',
                            source: context.source,
                            choices: opts.map((o) => o.choice),
                            handlers: opts.map((o) => o.handler)
                        });
                    }
                };
            }
            if(result.canCancel) {
                opts.push({
                    choice: 'Cancel',
                    handler: () => {
                        result.cancelled = true;
                    }
                });
            }

            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose additional fate',
                waitingPromptTitle: 'Waiting for opponent to take an action or pass',
                source: context.source,
                choices: opts.map((o) => o.choice),
                handlers: opts.map((o) => o.handler)
            });
        },
        pay(context: TriggeredAbilityContext & { chooseFate: number }) {
            context.player.fate -= context.chooseFate;
        },
        promptsPlayer: true
    };
}

export function discardCardsUpToVariableX(amountDerivable: Derivable<number, TriggeredAbilityContext>): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            return (
                derive(amountDerivable, context) > 0 &&
                context.game.actions.chosenDiscard().canAffect(context.player, context)
            );
        },
        resolve(context: TriggeredAbilityContext, result) {
            const amount = derive(amountDerivable, context);
            const max = Math.min(amount, context.player.hand.length);
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose up to ' + max + ' card' + (amount === 1 ? '' : 's') + ' to discard',
                context: context,
                mode: TargetMode.UpTo,
                numCards: amount,
                ordered: false,
                location: Location.Hand,
                controller: Players.Self,
                onSelect: (player: Player, cards: DrawCard[]) => {
                    if(cards.length === 0) {
                        context.costs.discardCardsUpToVariableX = [];
                        result.cancelled = true;
                    } else {
                        context.costs.discardCardsUpToVariableX = cards;
                    }
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent(context: TriggeredAbilityContext) {
            const action = context.game.actions.discardCard({ target: context.costs.discardCardsUpToVariableX as BaseCard[] });
            return action.getEvent(context.costs.discardCardsUpToVariableX, context);
        }
    };
}

export function discardCardsExactlyVariableX(amountDerivable: Derivable<number, TriggeredAbilityContext>): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            return (
                derive(amountDerivable, context) > 0 &&
                context.game.actions.chosenDiscard().canAffect(context.player, context)
            );
        },
        resolve(context: TriggeredAbilityContext, result) {
            const amount = derive(amountDerivable, context);
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose ' + amount + ' card' + (amount === 1 ? '' : 's') + ' to discard',
                context: context,
                mode: TargetMode.Exactly,
                numCards: amount,
                ordered: false,
                location: Location.Hand,
                controller: Players.Self,
                onSelect: (player: Player, cards: DrawCard[]) => {
                    if(cards.length === 0) {
                        context.costs.discardCardsExactlyVariableX = [];
                        result.cancelled = true;
                    } else {
                        context.costs.discardCardsExactlyVariableX = cards;
                    }
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent(context: TriggeredAbilityContext) {
            const action = context.game.actions.discardCard({ target: context.costs.discardCardsExactlyVariableX as BaseCard[] });
            return action.getEvent(context.costs.discardCardsExactlyVariableX, context);
        }
    };
}

export function discardHand(): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            return context.game.actions.chosenDiscard().canAffect(context.player, context);
        },
        resolve(context: TriggeredAbilityContext, _result) {
            context.costs.discardHand = context.player.hand.slice();
        },
        payEvent(context: TriggeredAbilityContext) {
            const action = context.game.actions.discardCard({ target: context.costs.discardHand as BaseCard[] });
            return action.getEvent(context.costs.discardHand, context);
        }
    };
}

export function optional(cost: Cost): Cost {
    const getActionName = (context: TriggeredAbilityContext) =>
        `optional${(cost.getActionName?.(context) ?? '').replace(/^./, (c) => c.toUpperCase())}`;

    return {
        promptsPlayer: true,
        canPay: () => true,
        getCostMessage: (context: TriggeredAbilityContext): unknown[] =>
            context.costs[getActionName(context)] ? (cost.getCostMessage?.(context) ?? []) : [],
        getActionName: getActionName,
        resolve: (context: TriggeredAbilityContext, result) => {
            if(!cost.canPay(context)) {
                return;
            }
            const actionName = getActionName(context);

            const choices = ['Yes', 'No'];
            const handlers = [
                () => {
                    context.costs[actionName] = true;
                },
                () => { }
            ];

            if(result.canCancel) {
                choices.push('Cancel');
                handlers.push(() => {
                    result.cancelled = true;
                });
            }

            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Pay optional cost?',
                source: context.source,
                choices: choices,
                handlers: handlers
            });
        },

        payEvent: (context: TriggeredAbilityContext) => {
            const actionName = getActionName(context);
            if(!context.costs[actionName]) {
                const doNothing = new HandlerAction({});
                return doNothing.getEvent(context.player, context);
            }

            const events: Event[] = [];
            cost.addEventsToArray?.(events, context, {});
            return events;
        }
    };
}

export function optionalFateCost(amount: number, forcePayment: (context: TriggeredAbilityContext) => boolean = () => false): Cost {
    return {
        promptsPlayer: true,
        canPay(context: TriggeredAbilityContext) {
            if(forcePayment(context)) {
                let fateAvailable = true;
                if(context.player.fate < amount) {
                    fateAvailable = false;
                }
                if(!context.player.checkRestrictions('spendFate', context)) {
                    fateAvailable = false;
                }
                return fateAvailable;
            }
            return true;
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'optionalFateCost';
        },
        getCostMessage: (context: TriggeredAbilityContext): unknown[] => {
            if(context.costs.optionalFateCost === 0) {
                return [];
            }
            return ['paying {1} fate', [amount]];
        },
        resolve(context: TriggeredAbilityContext, result) {
            let fateAvailable = true;
            if(context.player.fate < amount) {
                fateAvailable = false;
            }
            if(!context.player.checkRestrictions('spendFate', context)) {
                fateAvailable = false;
            }

            if(forcePayment(context) && fateAvailable) {
                context.costs.optionalFateCost = amount;
                return;
            }

            let choices: string[] = [];
            let handlers: Array<() => void> = [];
            context.costs.optionalFateCost = 0;

            if(fateAvailable) {
                choices = ['Yes', 'No'];
                handlers = [
                    () => (context.costs.optionalFateCost = amount),
                    () => (context.costs.optionalFateCost = 0)
                ];
            }
            if(fateAvailable && result.canCancel) {
                choices.push('Cancel');
                handlers.push(() => {
                    result.cancelled = true;
                });
            }

            if(choices.length > 0) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Spend ' + amount + ' fate?',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        },
        pay(context: TriggeredAbilityContext) {
            context.player.fate -= context.costs.optionalFateCost as number;
        }
    };
}

export function optionalGiveFateCost(amount: number): Cost {
    return {
        promptsPlayer: true,
        canPay() {
            return true;
        },
        resolve(context: TriggeredAbilityContext, result) {
            let fateAvailable = true;
            if(context.player.fate < amount) {
                fateAvailable = false;
            }
            if(!context.player.checkRestrictions('spendFate', context)) {
                fateAvailable = false;
            }
            if(!context.player.opponent || !context.player.opponent.checkRestrictions('gainFate', context)) {
                fateAvailable = false;
            }
            let choices: string[] = [];
            let handlers: Array<() => void> = [];
            context.costs.optionalFateCost = 0;

            if(fateAvailable) {
                choices = ['Yes', 'No'];
                handlers = [
                    () => (context.costs.optionalFateCost = amount),
                    () => (context.costs.optionalFateCost = 0)
                ];
            }
            if(fateAvailable && result.canCancel) {
                choices.push('Cancel');
                handlers.push(() => {
                    result.cancelled = true;
                });
            }

            if(choices.length > 0) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Give your opponent ' + amount + ' fate?',
                    source: context.source,
                    choices: choices,
                    handlers: handlers
                });
            }
        },
        pay(context: TriggeredAbilityContext) {
            context.player.fate -= context.costs.optionalFateCost as number;
            if(context.player.opponent) {
                context.player.opponent.fate += context.costs.optionalFateCost as number;
            }
        }
    };
}

export function optionalOpponentLoseHonor(
    prompt = 'Lose 1 honor?',
    canPayFunc?: (context: TriggeredAbilityContext) => boolean
): Cost {
    const NAME = 'optionalOpponentLoseHonorPaid';
    return {
        promptsPlayer: true,
        canPay: () => true,
        resolve: (context: TriggeredAbilityContext) => {
            context.costs[NAME] = false;

            if((typeof canPayFunc === 'function' && !canPayFunc(context)) || !context.player.opponent) {
                return;
            }

            const honorAvailable = context.game.actions.loseHonor().canAffect(context.player.opponent, context);
            if(honorAvailable) {
                context.game.promptWithHandlerMenu(context.player.opponent, {
                    activePromptTitle: prompt,
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [() => (context.costs[NAME] = true), () => (context.costs[NAME] = false)]
                });
            }
        },
        payEvent: (context: TriggeredAbilityContext) => {
            if(context.costs[NAME]) {
                context.game.addMessage('{0} chooses to lose 1 honor', context.player.opponent, context.player);
                return [
                    context.game.actions
                        .loseHonor({ target: context.player.opponent })
                        .getEvent(context.player.opponent, context)
                ];
            }

            return context.game.actions.noAction().getEvent(context.player, context);
        }
    };
}

export function optionalHonorTransferFromOpponentCost(canPayFunc = (_context: TriggeredAbilityContext) => true): Cost {
    return {
        promptsPlayer: true,
        canPay() {
            return true;
        },
        resolve(context: TriggeredAbilityContext, _result) {
            context.costs.optionalHonorTransferFromOpponentCostPaid = false;

            if(!canPayFunc(context)) {
                return;
            }

            if(!context.player.opponent) {
                return;
            }

            let honorAvailable = true;
            if(
                !context.game.actions.loseHonor().canAffect(context.player.opponent, context) ||
                !context.game.actions.gainHonor().canAffect(context.player, context)
            ) {
                honorAvailable = false;
            }

            if(honorAvailable) {
                context.game.promptWithHandlerMenu(context.player.opponent, {
                    activePromptTitle: 'Give an honor to your opponent?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => (context.costs.optionalHonorTransferFromOpponentCostPaid = true),
                        () => (context.costs.optionalHonorTransferFromOpponentCostPaid = false)
                    ]
                });
            }
        },
        payEvent(context: TriggeredAbilityContext) {
            if(context.costs.optionalHonorTransferFromOpponentCostPaid) {
                let events = [];

                context.game.addMessage('{0} chooses to give {1} 1 honor', context.player.opponent, context.player);
                let honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
                events.push(honorAction.getEvent(context.player.opponent, context));

                return events;
            }

            const doNothing = new HandlerAction({});
            return doNothing.getEvent(context.player, context);
        }
    };
}

export function nameCard(): Cost {
    return {
        selectCardName(player: Player, cardName: string, context: AbilityContext) {
            context.costs.nameCardCost = cardName;
            return true;
        },
        getActionName(_context: TriggeredAbilityContext) {
            return 'nameCard';
        },
        getCostMessage(context: TriggeredAbilityContext) {
            return ['naming {1}', [context.costs.nameCardCost]];
        },
        canPay() {
            return true;
        },
        resolve(context: TriggeredAbilityContext) {
            let dummyObject = {
                selectCardName: (player: Player, cardName: string, context: AbilityContext) => {
                    context.costs.nameCardCost = cardName;
                    return true;
                }
            };

            context.game.promptWithMenu(context.player, dummyObject, {
                context: context,
                activePrompt: {
                    menuTitle: 'Name a card',
                    controls: [
                        { type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }
                    ]
                }
            });
        },
        pay() { }
    };
}
