import { PlayType } from '../Constants.js';
import * as GameActions from '../GameActions/GameActions.js';
import { type Derivable, derive } from '../utils/helpers.js';
import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';
import type { Cost, CostContext } from './Cost.js';
import { GameActionCost } from './GameActionCost.js';
import { MetaActionCost } from './MetaActionCost.js';
import { ReduceableFateCost } from './ReduceableFateCost.js';
import { TargetDependentFateCost } from './TargetDependentFateCost.js';

/**
 * Cost that will pay the printed fate cost on the card minus any active
 * reducer effects the play has activated. Upon playing the card, all
 * matching reducer effects will expire, if applicable.
 */
export function payReduceableFateCost(ignoreType = false): Cost {
    return new ReduceableFateCost(ignoreType);
}

/**
 * Cost that is dependent on context.targets[targetName]
 */
export function payTargetDependentFateCost(targetName: string, ignoreType = false): Cost {
    return new TargetDependentFateCost(ignoreType, targetName);
}

/**
 * Cost in which the player must pay a fixed, non-reduceable amount of fate.
 */
export function payFate(amount: number | ((context: AbilityContext) => number) = 1): Cost {
    const amountFor = (context: AbilityContext) => typeof amount === 'function' ? amount(context) : amount;
    return Object.assign(
        new GameActionCost(GameActions.loseFate((context) => ({ target: context.player, amount: amountFor(context), spend: true }))),
        { fateSpent: amountFor }
    );
}

/**
 * Cost in which the player must pay a fixed, non-reduceable amount of honor.
 */
export function payHonor(amount = 1, dueToStatusToken = false): Cost {
    return new GameActionCost(GameActions.loseHonor((context) => ({ target: context.player, amount, dueToStatusToken })));
}

export function giveHonorToOpponent(amount = 1): Cost {
    return new GameActionCost(GameActions.takeHonor((context) => ({ target: context.player, amount })));
}

/**
 * Cost where a character must spend fate to an unclaimed ring
 */
export function payFateToRing(amount = 1, ringCondition = (ring: Ring) => ring.isUnclaimed()): Cost<{ ringPaidFateTo: Ring }> {
    return new MetaActionCost(
        GameActions.selectRing({
            ringCondition,
            gameAction: GameActions.placeFateOnRing((context) => ({ amount, origin: context.player }))
        }),
        'Select a ring to place fate on',
        'ringPaidFateTo'
    );
}

export function giveFateToOpponent(amount = 1): Cost {
    return new GameActionCost(GameActions.takeFate((context) => ({ target: context.player, amount })));
}

export function payVariableHonor(amountFunc: (context: AbilityContext) => number): Cost<{ honorPaid: number }> {
    return {
        promptsPlayer: true,
        canPay(context) {
            return amountFunc(context) > 0 && GameActions.loseHonor().canAffect(context.player, context);
        },
        resolve(context, result) {
            const amount = amountFunc(context);
            const max = Math.min(amount, context.player.honor);
            const choices = Array.from(Array(max), (_x, i) => String(i + 1));
            if(result.canCancel) {
                choices.push('Cancel');
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Choose how much honor to pay',
                context: context,
                choices: choices,
                choiceHandler: (choice: string) => {
                    if(choice === 'Cancel') {
                        context.costs.honorPaid = 0;
                        result.cancelled = true;
                    } else {
                        context.costs.honorPaid = parseInt(choice);
                    }
                }
            });
        },
        payEvent(context) {
            const action = GameActions.loseHonor({ amount: context.costs.honorPaid });
            return action.getEvent(context.player, context);
        }
    };
}

export function payVariableFate(properties: {
    activePromptTitle: string;
    minAmount?: Derivable<number, AbilityContext>;
    maxAmount: Derivable<number, AbilityContext>;
}): Cost<{ fatePaid: number }> {
    function deriveMinAmount(context: AbilityContext) {
        return properties.minAmount === undefined ? 1 : derive(properties.minAmount, context);
    }
    function deriveMaxAmount(context: AbilityContext) {
        return derive(properties.maxAmount, context);
    }
    return {
        promptsPlayer: true,
        canPay(context: AbilityContext<DrawCard>) {
            // ignoring the fate cost (Kunshu) makes X = 0 (EmeraldDB ruling)
            if(context.ignoreFateCost) {
                return deriveMinAmount(context) <= 0;
            }
            const costModifiers = context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);
            return (
                costModifiers < 0 ||
                (context.player.fate >= deriveMinAmount(context) + costModifiers &&
                    GameActions.loseFate({ spend: true }).canAffect(context.player, context))
            );
        },
        resolve(context: AbilityContext<DrawCard>, result) {
            if(context.ignoreFateCost) {
                context.costs.fatePaid = 0;
                return;
            }
            const costModifiers = context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);

            const maxAmount = deriveMaxAmount(context);
            const min = deriveMinAmount(context);
            let max = context.player.fate - costModifiers;
            if(maxAmount >= 0) {
                max = Math.min(maxAmount, context.player.fate - costModifiers);
            }
            if(!GameActions.loseFate({ spend: true }).canAffect(context.player, context)) {
                max = Math.min(max, -costModifiers);
            }
            const choices = Array.from({ length: max + 1 - min }, (_, idx) => String(idx + min));
            if(result.canCancel) {
                choices.push('Cancel');
            }
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: properties.activePromptTitle
                    ? properties.activePromptTitle
                    : 'Choose how much fate to pay',
                context: context,
                choices: choices,
                choiceHandler: (choice: string) => {
                    if(choice === 'Cancel') {
                        context.costs.fatePaid = 0;
                        result.cancelled = true;
                    } else {
                        context.costs.fatePaid = Math.max(0, parseInt(choice));
                    }
                }
            });
        },
        payEvent(context: CostContext<{ fatePaid: number }, AbilityContext<DrawCard>>) {
            const payZeroFate = GameActions.handler();
            if(context.ignoreFateCost) {
                return payZeroFate.getEvent(context.player, context);
            }

            const costModifiers = context.player.getTotalCostModifiers(PlayType.PlayFromHand, context.source);
            const cost = (context.costs.fatePaid ?? 0) + Math.min(0, costModifiers); //+ve cost modifiers are applied by the engine
            if(cost > 0) {
                const action = GameActions.loseFate({ amount: cost, spend: true });
                return action.getEvent(context.player, context);
            }

            return payZeroFate.getEvent(context.player, context);
        }
    };
}
