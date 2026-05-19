import StaticEffect from './StaticEffect.js';
import type { EffectNames } from '../Constants.js';

export default class DynamicEffect extends StaticEffect {
    values: Record<string, any>;
    calculate: (target: any, context: any) => any;

    constructor(type: EffectNames, calculate: (target: any, context: any) => any) {
        super(type, undefined);
        this.values = {};
        this.calculate = calculate;
    }

    apply(target: any) {
        super.apply(target);
        this.recalculate(target);
    }

    recalculate(target?: any): boolean {
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

    getValue(target?: any) {
        if(target) {
            return this.values[target.uuid];
        }
    }

    setValue(target: any, value: any) {
        this.values[target.uuid] = value;
        return value;
    }
}
