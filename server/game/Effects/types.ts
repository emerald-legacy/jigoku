import type { AbilityContext } from '../AbilityContext.js';
import type { EffectNames, Durations } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

export interface CardEffect {
    type: EffectNames;
    value: any;
    context: AbilityContext;
    duration?: Durations | null;
    isConditional?: boolean;
    getValue<T = any>(obj?: GameObject): T;
}
