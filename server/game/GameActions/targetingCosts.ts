import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { msg } from '../GameChat.js';
import { LoseFateAction } from './LoseFateAction.js';

interface TargetingCost {
    target: BaseCard;
    amount: number;
}

/**
 * "As an additional cost to choose … as a target": the fate the ability's player owes for each chosen card,
 * leaving out the cards already paid for (a following step keeps the earlier step's targets).
 */
export function targetingCosts(context: AbilityContext, targets: Iterable<BaseCard>): TargetingCost[] {
    const paid = context.targetingCostPaid;
    return [...new Set(targets)]
        .filter((target) => !paid.includes(target))
        .map((target) => ({ target, amount: context.player.getTargetingCost(context.source, target) }))
        .filter(({ amount }) => amount > 0);
}

export function totalTargetingCost(costs: TargetingCost[]): number {
    return costs.reduce((sum, { amount }) => sum + amount, 0);
}

export function canPayTargetingCosts(context: AbilityContext, costs: TargetingCost[]): boolean {
    return costs.length === 0 || context.player.canSpendFate(totalTargetingCost(costs), context);
}

export function payTargetingCosts(context: AbilityContext, costs: TargetingCost[]): void {
    if(costs.length === 0) {
        return;
    }
    for(const { target, amount } of costs) {
        context.game.addMessage(msg`${context.player} pays ${amount} fate in order to target ${target}`);
    }
    context.targetingCostPaid = [...context.targetingCostPaid, ...costs.map(({ target }) => target)];
    new LoseFateAction({ amount: totalTargetingCost(costs), spend: true }).resolve(context.player, context);
}
