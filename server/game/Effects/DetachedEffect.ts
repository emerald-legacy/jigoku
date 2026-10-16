import { EffectApplier } from './EffectApplier.js';
import { EffectValue } from './EffectValue.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

// Method syntax on purpose: the effect's match picks its targets, so the callbacks may take a narrower target type.
// `state` is what `apply` returned for this target.
export interface DetachedValue<Value, State = unknown> {
    apply(target: Value, context: AbilityContext, state?: unknown): State;
    unapply(target: Value, context: AbilityContext, state: State): unknown;
}

/** Runs its callbacks when applied and unapplied; its targets never hold it, so it has no value to read. */
export class DetachedEffect<EffectType extends EffectName = EffectName, Target extends GameObject = GameObject, State = unknown> extends EffectApplier<EffectType, Target, boolean> {
    value = new EffectValue(true);
    detached: DetachedValue<Target, State>;
    // what apply returned, until unapply; then what unapply returned, until the next apply
    applied: Record<string, State> = {};
    leftover: Record<string, unknown> = {};

    constructor(type: EffectType, detached: DetachedValue<Target, State>) {
        super(type);
        this.detached = detached;
    }

    apply(target: Target) {
        this.applied[target.uuid] = this.detached.apply(target, this.context, this.leftover[target.uuid]);
        delete this.leftover[target.uuid];
    }

    unapply(target: Target) {
        const state = this.detached.unapply(target, this.context, this.applied[target.uuid]);
        delete this.applied[target.uuid];
        if(state !== undefined) {
            this.leftover[target.uuid] = state;
        }
    }

    getValue(target: GameObject): boolean;
    getValue(): boolean | undefined;
    getValue(): boolean {
        return this.value.getValue();
    }

    setContext(context: AbilityContext) {
        this.context = context;
        for(const state of [...Object.values(this.applied), ...Object.values(this.leftover)]) {
            if(state && typeof state === 'object' && 'context' in state && state.context) {
                state.context = context;
            }
        }
    }
}
