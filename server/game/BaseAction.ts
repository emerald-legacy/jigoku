import { AbilityContext } from './AbilityContext.js';
import { AbilityType, Blocker } from './Constants.js';
import { BaseCardAbility } from './BaseCardAbility.js';
import type BaseCard from './BaseCard.js';
import type { Cost } from './costs/Cost.js';
import type { BaseAbilityProperties } from './BaseAbility.js';

type TargetProperties = NonNullable<BaseAbilityProperties['target']>;

export class BaseAction extends BaseCardAbility {
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

    meetsRequirements(context: AbilityContext, ignoredBlockers: Blocker[] = []): Blocker {
        if(this.breaksLimitedRule(context)) {
            return Blocker.LimitedAlreadyPlayed;
        }

        return super.meetsRequirements(context, ignoredBlockers);
    }

    getReducedCost(context: AbilityContext): number {
        return this.reducedFateCost(context);
    }

    isAction(): boolean {
        return true;
    }
}

