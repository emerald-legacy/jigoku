import { EffectValue, EffectValueBase } from './EffectValue.js';
import { EffectBase } from './EffectBase.js';
import type { EffectName } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import type { EffectValueMap } from './EffectValueMap.js';

export type StaticValue<N extends EffectName, T extends GameObject> = EffectValueMap[N] | EffectValueBase<EffectValueMap[N], T>;

class StaticEffect<N extends EffectName = EffectName, T extends GameObject = GameObject> extends EffectBase<N, T> {
    value: EffectValueBase<EffectValueMap[N], T>;
    copies = new Map<string, EffectValueBase<EffectValueMap[N], T>>();

    constructor(type: N, value: StaticValue<N, T>) {
        super(type);
        if(value instanceof EffectValueBase) {
            this.value = value;
        } else {
            this.value = new EffectValue(value);
        }
        this.value.reset();
    }

    apply(target: T) {
        target.addEffect(this);
        const copy = this.value.copyForTarget();
        if(copy) {
            copy.apply(target);
            this.copies.set(target.uuid, copy);
        } else {
            this.value.apply(target);
        }
    }

    unapply(target: T) {
        target.removeEffect(this);
        const copy = this.copies.get(target.uuid);
        if(copy) {
            copy.unapply(target);
            this.copies.delete(target.uuid);
        } else {
            this.value.unapply(target);
        }
    }

    getValue(target: GameObject): EffectValueMap[N];
    getValue(): EffectValueMap[N] | undefined;
    getValue(): EffectValueMap[N] {
        return this.value.getValue();
    }

    recalculate(_target: T) {
        return this.value.recalculate();
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

export default StaticEffect;
