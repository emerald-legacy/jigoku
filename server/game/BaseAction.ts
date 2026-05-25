import { AbilityContext } from './AbilityContext.js';
import BaseAbility from './baseability.js';
import { Stages } from './Constants.js';
import type Player from './player.js';
import type BaseCard from './basecard.js';

interface Cost {
    getReducedCost?(context: AbilityContext): number;
    [key: string]: any;
}

interface TargetProperties {
    [key: string]: any;
}

class BaseAction extends BaseAbility {
    card: BaseCard;
    abilityType = 'action';
    cannotBeCancelled = true;
    declare cost: Cost[];

    constructor(card: BaseCard, costs: Cost[] = [], target?: TargetProperties) {
        const properties: { cost: Cost[]; target?: TargetProperties } = { cost: costs };
        if(target) {
            properties.target = target;
        }
        super(properties);
        this.card = card;
    }

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []): string {
        if(this.isCardPlayed() && this.card.isLimited() && context.player.limitedPlayed >= context.player.maxLimited) {
            return 'limited';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    createContext(player: Player = this.card.controller): AbilityContext {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card,
            stage: Stages.PreTarget
        });
    }

    getReducedCost(context: AbilityContext): number {
        const fateCost = this.cost.find((cost) => cost.getReducedCost);
        return fateCost?.getReducedCost?.(context) ?? 0;
    }

    isAction(): boolean {
        return true;
    }
}

export default BaseAction;
