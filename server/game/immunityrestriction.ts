import { Stages } from './Constants.js';
import type { AbilityContext } from './AbilityContext';

class ImmunityRestriction {
    condition: (context: AbilityContext) => boolean;

    constructor(condition: (context: AbilityContext) => boolean) {
        this.condition = condition;
    }

    isMatch(type: string, abilityContext: AbilityContext | null): boolean {
        return Boolean(
            abilityContext &&
            abilityContext.stage !== Stages.Cost &&
            this.condition(abilityContext)
        );
    }
}

export = ImmunityRestriction;
