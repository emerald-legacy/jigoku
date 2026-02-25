import type { AbilityContext } from '../AbilityContext';
import type { EffectNames } from '../Constants';
import type { GameObject } from '../GameObject';

export interface CardEffect {
    type: EffectNames;
    value: any;
    context: AbilityContext;
    getValue: <T = any>(obj: GameObject) => T;
}
