import StaticEffect from './StaticEffect.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectNames } from '../Constants.js';
import type { EffectTarget } from './EffectBuilder.js';
import type { GameObject } from '../GameObject.js';

type DynamicCalculate = (target: EffectTarget, context: AbilityContext) => unknown;

export default class DynamicEffect extends StaticEffect {
    values: Record<string, unknown>;
    calculate: DynamicCalculate;

    constructor(type: EffectNames, calculate: DynamicCalculate) {
        super(type, undefined);
        this.values = {};
        this.calculate = calculate;
    }

    apply(target: GameObject) {
        super.apply(target);
        this.recalculate(target);
    }

    recalculate(target?: GameObject): boolean {
        if(!target) {
            return false;
        }
        let oldValue = this.getValue(target);
        let newValue = this.setValue(target, this.calculate(target as EffectTarget, this.context));
        if(typeof oldValue === 'function' && typeof newValue === 'function') {
            return oldValue.toString() !== newValue.toString();
        }
        if(Array.isArray(oldValue) && Array.isArray(newValue)) {
            if(oldValue.length !== newValue.length) {
                return true;
            }
            for(let i = 0; i < oldValue.length; i++) {
                if(oldValue[i] !== newValue[i]) {
                    return true;
                }
            }
            return false;
        }
        return oldValue !== newValue;
    }

    getValue(target?: GameObject): unknown {
        if(target) {
            return this.values[target.uuid];
        }
        return undefined;
    }

    setValue(target: GameObject, value: unknown) {
        this.values[target.uuid] = value;
        return value;
    }
}
