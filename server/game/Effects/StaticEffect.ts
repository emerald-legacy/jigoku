import { EffectValue, EffectValueBase } from './EffectValue.js';
import { EffectApplier } from './EffectApplier.js';
import type { EffectName } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import type { EffectValueMap } from './EffectValueMap.js';

export type StaticValue<EffectType extends EffectName, Target extends GameObject> = EffectValueMap[EffectType] | EffectValueBase<EffectValueMap[EffectType], Target>;

export class StaticEffect<EffectType extends EffectName = EffectName, Target extends GameObject = GameObject> extends EffectApplier<EffectType, Target> {
    value: EffectValueBase<EffectValueMap[EffectType], Target>;
    copies = new Map<string, EffectValueBase<EffectValueMap[EffectType], Target>>();

    constructor(type: EffectType, value: StaticValue<EffectType, Target>) {
        super(type);
        if(value instanceof EffectValueBase) {
            this.value = value.copyForEffect();
        } else {
            this.value = new EffectValue(value);
        }
        this.value.reset();
    }

    apply(target: Target) {
        target.addEffect(this);
        const copy = this.value.copyForTarget();
        if(copy) {
            copy.apply(target);
            this.copies.set(target.uuid, copy);
        } else {
            this.value.apply(target);
        }
    }

    unapply(target: Target) {
        target.removeEffect(this);
        const copy = this.copies.get(target.uuid);
        if(copy) {
            copy.unapply(target);
            this.copies.delete(target.uuid);
        } else {
            this.value.unapply(target);
        }
    }

    getValue(target: GameObject): EffectValueMap[EffectType];
    getValue(): EffectValueMap[EffectType] | undefined;
    getValue(): EffectValueMap[EffectType] {
        return this.value.getValue();
    }

    override recalculate(_target: Target) {
        return this.value.recalculate();
    }

    setContext(context: AbilityContext) {
        this.context = context;
        this.value.setContext(context);
    }
}

