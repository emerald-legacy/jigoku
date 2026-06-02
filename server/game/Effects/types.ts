import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName, Duration } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

export interface CardEffect {
    type: EffectName;
    value: any;
    context: AbilityContext;
    duration?: Duration | null;
    isConditional?: boolean;
    getValue<T = any>(obj?: GameObject): T;
}
