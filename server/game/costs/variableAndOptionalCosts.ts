import { msg } from '../GameChat.js';
import { EventName, Location, Players, PlayType, TargetMode, RestrictionType } from '../Constants.js';
import { Event } from '../Events/Event.js';
import { HandlerAction } from '../GameActions/HandlerAction.js';
import { Derivable, derive } from '../utils/helpers.js';
import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import Ring from '../Ring.js';
import type { Cost, Result } from './Cost.js';
import type { HandlerMenuOption } from '../gamesteps/HandlerMenuPrompt.js';

export function returnRings(amount = -1, ringCondition = (_ring: Ring, _context: AbilityContext) => true): Cost<{ returnedRings: Ring[] }> {
    return {
        promptsPlayer: true,
        canPay(context) {
            for(const ring of Object.values(context.game.rings)) {
                if(ring.claimedBy === context.player.name && ringCondition(ring, context)) {
                    return true;
                }
            }
            return false;
        },
        getActionName(_context) {
            return 'returnedRings';
        },
        getCostMessage(context) {
            return ['returning the {1}', [context.costs.returnedRings]];
        },
        resolve(context, result) {
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
                    onSelect: (_player: Player, ring: Ring) => {
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
                            context.costs.returnedRings = chosenRings;
                        }
                        return true;
                    },
                    onMenuCommand: (_player: Player, arg: string): boolean | undefined => {
                        if(arg === 'done') {
                            context.costs.returnedRings = chosenRings;
                            return true;
                        }
                        return undefined;
                    },
                    onCancel: () => {
                        context.costs.returnedRings = [];
                        result.cancelled = true;
                    }
                });
            };
            promptPlayer();
        },
        payEvent(context) {
            return context.game.actions.returnRing({ target: context.costs.returnedRings }).getEventArray(context);
        }
    };
}

export function chooseFate(type: PlayType): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext<DrawCard>, result: Result) {
            context.chooseFate = 0;

            let extrafate = context.player.fate - context.player.getReducedCost(type, context.source);
            if(!context.player.checkRestrictions(RestrictionType.PlaceFateWhenPlayingCharacter, context)) {
                extrafate = 0;
            }
            if(
                !context.player.checkRestrictions(RestrictionType.PlaceFateWhenPlayingCharacterFromProvince, context) &&
                type === PlayType.PlayFromProvince
            ) {
                extrafate = 0;
            }
            if(!context.player.checkRestrictions(RestrictionType.SpendFate, context)) {
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
                            options: opts.map((o) => ({ text: o.choice, handler: o.handler }))
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
                options: opts.map((o) => ({ text: o.choice, handler: o.handler }))
            });
        },
        pay(context) {
            context.player.fate -= context.chooseFate;
        },
        promptsPlayer: true
    };
}

export function discardCardsUpToVariableX(amountDerivable: Derivable<number, AbilityContext>): Cost<{ discardCardsUpToVariableX: DrawCard[] }> {
    return {
        promptsPlayer: true,
        canPay(context) {
            return (
                derive(amountDerivable, context) > 0 &&
                context.game.actions.chosenDiscard().canAffect(context.player, context)
            );
        },
        resolve(context, result) {
            const amount = derive(amountDerivable, context);
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose up to ' + Math.min(amount, context.player.hand.length) + ' card' + (amount === 1 ? '' : 's') + ' to discard',
                context: context,
                mode: TargetMode.UpTo,
                numCards: amount,
                ordered: false,
                location: Location.Hand,
                controller: Players.Self,
                onSelect: (_player: Player, cards) => {
                    context.costs.discardCardsUpToVariableX = cards.filter((card) => card.isDrawCard());
                    if(cards.length === 0) {
                        result.cancelled = true;
                    }
                    return true;
                },
                onCancel: () => {
                    result.cancelled = true;
                    return true;
                }
            });
        },
        payEvent(context) {
            const action = context.game.actions.discardCard({ target: context.costs.discardCardsUpToVariableX });
            return action.getEvent(context.costs.discardCardsUpToVariableX ?? [], context);
        }
    };
}

export function discardHand(): Cost<{ discardHand: DrawCard[] }> {
    return {
        promptsPlayer: true,
        canPay(context) {
            return context.game.actions.chosenDiscard().canAffect(context.player, context);
        },
        resolve(context, _result) {
            context.costs.discardHand = context.player.hand.slice();
        },
        payEvent(context) {
            const action = context.game.actions.discardCard({ target: context.costs.discardHand });
            return action.getEvent(context.costs.discardHand, context);
        }
    };
}

export function optional(cost: Cost): Cost {
    const getActionName = (context: AbilityContext) =>
        `optional${(cost.getActionName?.(context) ?? '').replace(/^./, (c) => c.toUpperCase())}`;

    return {
        promptsPlayer: true,
        canPay: () => true,
        getCostMessage: (context) =>
            context.costs[getActionName(context)] ? (cost.getCostMessage?.(context) ?? []) : [],
        getActionName: getActionName,
        resolve: (context, result) => {
            if(!cost.canPay(context)) {
                return;
            }
            const actionName = getActionName(context);

            const options: HandlerMenuOption[] = [
                {
                    text: 'Yes',
                    handler: () => {
                        context.costs[actionName] = true;
                    }
                },
                { text: 'No', handler: () => { } }
            ];

            if(result.canCancel) {
                options.push({
                    text: 'Cancel',
                    handler: () => {
                        result.cancelled = true;
                    }
                });
            }

            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Pay optional cost?',
                source: context.source,
                options
            });
        },

        payEvent: (context) => {
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

/** "Pay X or Y": the player picks one of the payable costs, without a question when only one can be paid. */
export function chooseOne(options: Record<string, Cost>): Cost<{ chosenCostLabel: string }> {
    const chosen = (context: AbilityContext) => {
        const label = context.costs.chosenCostLabel;
        return typeof label === 'string' ? options[label] : undefined;
    };
    return {
        promptsPlayer: true,
        canPay: (context) => Object.values(options).some((cost) => cost.canPay(context)),
        getActionName: (context) => chosen(context)?.getActionName?.(context) ?? 'chosenCostLabel',
        getCostMessage: (context) => chosen(context)?.getCostMessage?.(context) ?? [],
        addEventsToArray(events, context, result = {}) {
            const pay = (label: string) => {
                context.costs.chosenCostLabel = label;
                const cost = options[label];
                if(cost.addEventsToArray) {
                    cost.addEventsToArray(events, context, result);
                    return;
                }
                cost.resolve?.(context, result);
                context.game.queueSimpleStep(() => {
                    if(!result.cancelled) {
                        const paid = cost.payEvent ? cost.payEvent(context) : context.game.getEvent(EventName.PayCost, {}, () => cost.pay?.(context));
                        events.push(...(Array.isArray(paid) ? paid : [paid]));
                    }
                });
            };
            const payable = Object.keys(options).filter((label) => options[label].canPay(context));
            if(payable.length === 1) {
                pay(payable[0]);
                return;
            }
            const menu: HandlerMenuOption[] = payable.map((label) => ({ text: label, handler: () => pay(label) }));
            if(result.canCancel) {
                menu.push({ text: 'Cancel', handler: () => {
                    result.cancelled = true;
                } });
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose a cost to pay',
                source: context.source,
                options: menu
            });
        }
    };
}

export function payOptionalFate(amount: number, forcePayment: (context: AbilityContext) => boolean = () => false): Cost<{ optionalFatePaid: number }> {
    return {
        promptsPlayer: true,
        canPay(context) {
            if(forcePayment(context)) {
                let fateAvailable = true;
                if(context.player.fate < amount) {
                    fateAvailable = false;
                }
                if(!context.player.checkRestrictions(RestrictionType.SpendFate, context)) {
                    fateAvailable = false;
                }
                return fateAvailable;
            }
            return true;
        },
        getActionName(_context) {
            return 'optionalFatePaid';
        },
        getCostMessage: (context) => {
            if(context.costs.optionalFatePaid === 0) {
                return [];
            }
            return ['paying {1} fate', [amount]];
        },
        resolve(context, result) {
            let fateAvailable = true;
            if(context.player.fate < amount) {
                fateAvailable = false;
            }
            if(!context.player.checkRestrictions(RestrictionType.SpendFate, context)) {
                fateAvailable = false;
            }

            if(forcePayment(context) && fateAvailable) {
                context.costs.optionalFatePaid = amount;
                return;
            }

            const options: HandlerMenuOption[] = [];
            context.costs.optionalFatePaid = 0;

            if(fateAvailable) {
                options.push(
                    { text: 'Yes', handler: () => (context.costs.optionalFatePaid = amount) },
                    { text: 'No', handler: () => (context.costs.optionalFatePaid = 0) }
                );
            }
            if(fateAvailable && result.canCancel) {
                options.push({
                    text: 'Cancel',
                    handler: () => {
                        result.cancelled = true;
                    }
                });
            }

            if(options.length > 0) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Spend ' + amount + ' fate?',
                    source: context.source,
                    options
                });
            }
        },
        pay(context) {
            context.player.fate -= context.costs.optionalFatePaid ?? 0;
        }
    };
}

export function optionalOpponentLoseHonor(
    prompt = 'Lose 1 honor?',
    canPayFunc = (_context: AbilityContext) => true
): Cost<{ optionalOpponentLoseHonorPaid: boolean }> {
    const NAME = 'optionalOpponentLoseHonorPaid';
    return {
        promptsPlayer: true,
        canPay: () => true,
        resolve: (context) => {
            context.costs[NAME] = false;

            if(!canPayFunc(context) || !context.player.opponent) {
                return;
            }

            const honorAvailable = context.game.actions.loseHonor().canAffect(context.player.opponent, context);
            if(honorAvailable) {
                context.game.promptWithHandlerMenu(context.player.opponent, {
                    activePromptTitle: prompt,
                    source: context.source,
                    options: [{ text: 'Yes', handler: () => (context.costs[NAME] = true) }, { text: 'No', handler: () => (context.costs[NAME] = false) }]
                });
            }
        },
        payEvent: (context) => {
            if(context.costs[NAME]) {
                context.game.addMessage(msg`${context.player.opponent} chooses to lose 1 honor`);
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

export function optionalTakeHonorFromOpponent(canPayFunc = (_context: AbilityContext) => true): Cost<{ honorTakenFromOpponent: boolean }> {
    return {
        promptsPlayer: true,
        canPay() {
            return true;
        },
        resolve(context, _result) {
            context.costs.honorTakenFromOpponent = false;

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
                    options: [
                        { text: 'Yes', handler: () => (context.costs.honorTakenFromOpponent = true) },
                        { text: 'No', handler: () => (context.costs.honorTakenFromOpponent = false) }
                    ]
                });
            }
        },
        payEvent(context) {
            if(context.costs.honorTakenFromOpponent) {
                const events = [];

                context.game.addMessage(msg`${context.player.opponent} chooses to give ${context.player} 1 honor`);
                const honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
                events.push(honorAction.getEvent(context.player.opponent, context));

                return events;
            }

            const doNothing = new HandlerAction({});
            return doNothing.getEvent(context.player, context);
        }
    };
}

export function nameCard(): Cost<{ namedCard: string }> {
    return {
        getActionName(_context) {
            return 'nameCard';
        },
        getCostMessage(context) {
            return ['naming {1}', [context.costs.namedCard]];
        },
        canPay() {
            return true;
        },
        resolve(context) {
            context.game.promptForCardName(context.player, (_player, cardName) => {
                context.costs.namedCard = cardName;
            });
        },
        pay() { }
    };
}
