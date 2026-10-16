import { EffectApplier } from './EffectApplier.js';
import { EffectValue } from './EffectValue.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';
import type { EffectValueMap } from './EffectValueMap.js';

// Method syntax on purpose: the effect's match picks its targets, so a calculation may take a narrower target type.
interface Calculation<Target, Value> {
    calculate(target: Target, context: AbilityContext): Value;
}
export type DynamicValue<Value, Target> = Calculation<Target, Value>['calculate'];

export class DynamicEffect<EffectType extends EffectName = EffectName, Target extends GameObject = GameObject> extends EffectApplier<EffectType, Target> {
    value = new EffectValue(true);
    values: Record<string, EffectValueMap[EffectType]>;
    calculate: DynamicValue<EffectValueMap[EffectType], Target>;

    constructor(type: EffectType, calculate: DynamicValue<EffectValueMap[EffectType], Target>) {
        super(type);
        this.values = {};
        this.calculate = calculate;
    }

    apply(target: Target) {
        target.addEffect(this);
        this.recalculate(target);
    }

    unapply(target: Target) {
        target.removeEffect(this);
    }

    override recalculate(target: Target): boolean {
        if(!target) {
            return false;
        }
        const oldValue = this.getValue(target);
        const newValue = this.setValue(target, this.calculate(target, this.context));
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

    getValue(target: GameObject): EffectValueMap[EffectType];
    getValue(): EffectValueMap[EffectType] | undefined;
    getValue(target?: GameObject): EffectValueMap[EffectType] | undefined {
        return target ? this.values[target.uuid] : undefined;
    }

    setValue(target: GameObject, value: EffectValueMap[EffectType]) {
        this.values[target.uuid] = value;
        return value;
    }

    setContext(context: AbilityContext) {
        this.context = context;
        this.value.setContext(context);
    }
}
