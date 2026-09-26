import { AbilityContext } from './AbilityContext.js';
import { AbilityType } from './Constants.js';
import BaseCardAbility from './BaseCardAbility.js';
import type BaseCard from './BaseCard.js';
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
        if(this.isCardPlayed() && this.card.isDrawCard() && this.card.isLimited() && context.player.limitedPlayed >= context.player.maxLimited) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    getReducedCost(context: AbilityContext): number {
        for(const cost of this.cost) {
            if(cost.getReducedCost) {
                return cost.getReducedCost(context);
            }
        }
        return 0;
    }

    isAction(): boolean {
        return true;
    }
}

export default BaseAction;
