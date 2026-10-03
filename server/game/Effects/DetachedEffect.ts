import { EffectBase } from './EffectBase.js';
import { EffectValue } from './EffectValue.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EffectName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

// Method syntax on purpose: the effect's match picks its targets, so the callbacks may take a narrower target type.
// `state` is what `apply` returned for this target.
export interface DetachedValue<T, S = unknown> {
    apply(target: T, context: AbilityContext, state?: unknown): S;
    unapply(target: T, context: AbilityContext, state: S): unknown;
}

/** Runs its callbacks when applied and unapplied; its targets never hold it, so it has no value to read. */
export default class DetachedEffect<N extends EffectName = EffectName, T extends GameObject = GameObject, S = unknown> extends EffectBase<N, T, boolean> {
    value = new EffectValue(true);
    detached: DetachedValue<T, S>;
    // what apply returned, until unapply; then what unapply returned, until the next apply
    applied: Record<string, S> = {};
    leftover: Record<string, unknown> = {};

    constructor(type: N, detached: DetachedValue<T, S>) {
        super(type);
        this.detached = detached;
    }

    apply(target: T) {
        this.applied[target.uuid] = this.detached.apply(target, this.context, this.leftover[target.uuid]);
        delete this.leftover[target.uuid];
    }

    unapply(target: T) {
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

    getDebugInfo() {
        return {
            type: this.type,
            value: this.value
        };
    }
}
