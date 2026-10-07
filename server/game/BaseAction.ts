import { AbilityContext } from './AbilityContext.js';
import { AbilityType } from './Constants.js';
import BaseCardAbility from './BaseCardAbility.js';
import type BaseCard from './BaseCard.js';
import type { Cost } from './costs/Cost.js';
import type { BaseAbilityProperties } from './BaseAbility.js';

type TargetProperties = NonNullable<BaseAbilityProperties['target']>;

class BaseAction extends BaseCardAbility {
    abilityType = AbilityType.Action;
    cannotBeCancelled = true;
    declare cost: Cost[];

    constructor(card: BaseCard, costs: Cost[] = [], target?: TargetProperties) {
        const properties: { cost: Cost[]; target?: TargetProperties } = { cost: costs };
        if(target) {
            properties.target = target;
        }
        super(card, properties);
    }

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []): string {
        if(this.breaksLimitedRule(context)) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    getReducedCost(context: AbilityContext): number {
        return this.reducibleCost(context);
    }

    isAction(): boolean {
        return true;
    }
}

export default BaseAction;
