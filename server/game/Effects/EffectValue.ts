import type { AbilityContext } from '../AbilityContext.js';

/** What a static effect holds: resolves to `Value` and hooks into apply/unapply on targets of type `Target`. */
export abstract class EffectValueBase<Value, Target = unknown> {
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

    public abstract getValue(): Value;

    public recalculate(): boolean {
        return false;
    }

    public reset(): void {}

    /** A holder to apply to this target instead of this one. */
    public copyForTarget(): EffectValueBase<Value, Target> | undefined {
        return undefined;
    }

    public apply(_target: Target): void {}

    public unapply(_target: Target): void {}
}

export class EffectValue<Value, Target = unknown> extends EffectValueBase<Value, Target> {
    value: Value;

    constructor(value: Value) {
        super();
        this.value = value;
    }

    public setValue(value: Value) {
        this.value = value;
    }

    public getValue(): Value {
        return this.value;
    }
}
