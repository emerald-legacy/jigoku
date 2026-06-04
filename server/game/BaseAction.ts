import { AbilityContext } from './AbilityContext.js';
import { AbilityType } from './Constants.js';
import BaseCardAbility from './BaseCardAbility.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { Cost } from './costs/Cost.js';

interface TargetProperties {
    [key: string]: unknown;
}

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
        if(this.isCardPlayed() && (this.card as DrawCard).isLimited() && context.player.limitedPlayed >= context.player.maxLimited) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    getReducedCost(context: AbilityContext): number {
        const fateCost = this.cost.find(
            (cost): cost is Cost & { getReducedCost(context: AbilityContext): number } =>
                !!(cost as { getReducedCost?: unknown }).getReducedCost
        );
        return fateCost ? fateCost.getReducedCost(context) : 0;
    }

    isAction(): boolean {
        return true;
    }
}

export default BaseAction;
