import type { AbilityContext } from '../AbilityContext.js';
import type { Cost } from '../costs/Cost.js';

/** A free cost that records `capture(context)` as `context.costs[name]`, before later costs change it. */
export function captureCost<N extends string, V>(name: N, capture: (context: AbilityContext) => V): Cost<{ [K in N]: V }> {
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
