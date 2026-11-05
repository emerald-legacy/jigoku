import type { AbilityContext } from '../AbilityContext.js';
import { EffectValueBase } from './EffectValue.js';

/** A static effect value that answers for a subject with the effect's own context (a copy of the card has its own). */
export class ContextFunction<Subject, Result> extends EffectValueBase<ContextFunction<Subject, Result>> {
    constructor(private readonly fn: (subject: Subject, context: AbilityContext) => Result) {
        super();
    }

    getValue(): ContextFunction<Subject, Result> {
        return this;
    }

    override copyForEffect(): ContextFunction<Subject, Result> {
        return new ContextFunction(this.fn);
    }

    call(subject: Subject): Result {
        return this.fn(subject, this.requireContext());
    }
}
