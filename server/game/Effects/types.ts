import type { AbilityContext } from '../AbilityContext.js';
import type { EffectNames } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

export interface CardEffect {
    type: EffectNames;
    value: any;
    context: AbilityContext;
    getValue: <T = any>(obj: GameObject) => T;
}
