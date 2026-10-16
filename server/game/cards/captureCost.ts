import type { AbilityContext } from '../AbilityContext.js';
import type { Cost } from '../costs/Cost.js';

/** A free cost that records `capture(context)` as `context.costs[name]`, before later costs change it. */
export function captureCost<Name extends string, Value>(name: Name, capture: (context: AbilityContext) => Value): Cost<{ [Key in Name]: Value }> {
    return {
        canPay() {
            return true;
        },
        resolve(context) {
            Object.assign(context.costs, { [name]: capture(context) });
        },
        pay() {}
    };
}
