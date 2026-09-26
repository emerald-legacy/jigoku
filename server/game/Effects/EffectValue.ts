import type { AbilityContext } from '../AbilityContext.js';

/** What a static effect holds: resolves to `V` and hooks into apply/unapply on targets of type `T`. */
export abstract class EffectValueBase<V, T = unknown> {
    // set by the effect before it applies; a holder applied on its own has none
    context?: AbilityContext;

    public setContext(context: AbilityContext): void {
        this.context = context;
    }

    /** For reads that only happen once the effect has set the context. */
    public requireContext(): AbilityContext {
        if(!this.context) {
            throw new Error('Effect value read before its context was set');
        }
        return this.context;
    }

    public abstract getValue(): V;

    public recalculate(): boolean {
        return false;
    }

    public reset(): void {}

    /** A holder to apply to this target instead of this one. */
    public copyForTarget(): EffectValueBase<V, T> | undefined {
        return undefined;
    }

    public apply(_target: T): void {}

    public unapply(_target: T): void {}
}

export class EffectValue<V, T = unknown> extends EffectValueBase<V, T> {
    value: V;

    constructor(value: V) {
        super();
        this.value = value;
    }

    public setValue(value: V) {
        this.value = value;
    }

    public getValue(): V {
        return this.value;
    }
}
