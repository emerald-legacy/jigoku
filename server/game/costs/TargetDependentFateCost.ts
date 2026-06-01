import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type { Cost } from '../Costs.js';
import { Event } from '../Events/Event.js';
import { ReduceableFateCost } from './ReduceableFateCost.js';

export class TargetDependentFateCost extends ReduceableFateCost implements Cost {
    constructor(ignoreType: boolean, public dependsOn: string) {
        super(ignoreType);
    }

    public canPay(context: AbilityContext): boolean {
        if(context.source.printedCost === null) {
            return false;
        }
        if(!context.targets[this.dependsOn]) {
            // we don't need to check now because this will be checked again once targeting is done
            return true;
        }
        const reducedCost = context.player.getMinimumCost(
            context.playType ?? '',
            context,
            context.targets[this.dependsOn],
            this.ignoreType
        );
        return (
            context.player.fate >= reducedCost &&
            (reducedCost === 0 || context.player.checkRestrictions('spendFate', context))
        );
    }

    public payEvent(context: AbilityContext): Event {
        const amount = (context.costs.targetDependentFate = this.getReducedCost(context));
        return new Event(EventNames.OnSpendFate, { amount, context }, () => {
            context.player.markUsedReducers(
                context.playType ?? '',
                context.source,
                context.targets[this.dependsOn]
            );
            context.player.fate -= this.getFinalFatecost(context, amount);
        });
    }

    protected getReducedCost(context: AbilityContext): number {
        return context.player.getReducedCost(
            context.playType ?? '',
            context.source,
            context.targets[this.dependsOn],
            this.ignoreType
        );
    }
}
