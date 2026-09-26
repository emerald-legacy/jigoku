import { EffectBase } from './EffectBase.js';
import { EffectValue } from './EffectValue.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { EffectValueMap } from './EffectValueMap.js';

// Method syntax on purpose: the effect's match picks its targets, so a calculation may take a narrower target type.
interface Calculation<T, V> {
    calculate(target: T, context: AbilityContext): V;
}
export type DynamicValue<V, T> = Calculation<T, V>['calculate'];

export default class DynamicEffect<N extends EffectName = EffectName, T extends GameObject = GameObject> extends EffectBase<N, T> {
    value = new EffectValue(true);
    values: Record<string, EffectValueMap[N]>;
    calculate: DynamicValue<EffectValueMap[N], T>;

    constructor(type: N, calculate: DynamicValue<EffectValueMap[N], T>) {
        super(type);
        this.values = {};
        this.calculate = calculate;
    }

    apply(target: T) {
        target.addEffect(this);
        this.recalculate(target);
    }

    unapply(target: T) {
        target.removeEffect(this);
    }

    recalculate(target: T): boolean {
        if(!target) {
            return false;
        }
        let oldValue = this.getValue(target);
        let newValue = this.setValue(target, this.calculate(target, this.context));
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

    getValue(target: GameObject): EffectValueMap[N];
    getValue(): EffectValueMap[N] | undefined;
    getValue(target?: GameObject): EffectValueMap[N] | undefined {
        return target ? this.values[target.uuid] : undefined;
    }

    setValue(target: GameObject, value: EffectValueMap[N]) {
        this.values[target.uuid] = value;
        return value;
    }

    setContext(context: AbilityContext) {
        this.context = context;
        this.value.setContext(context);
    }

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}
