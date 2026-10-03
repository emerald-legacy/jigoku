import type { Cost } from '../costs/Cost.js';
import type DrawCard from '../DrawCard.js';

/** A free cost that records the source's parent character before later costs move the source. */
export function captureParentCost(): Cost<{ captureParentCost: DrawCard | null }> {
    return {
        canPay() {
            return true;
        },
        resolve(context) {
            context.costs.captureParentCost = context.source.parentCharacter;
        },
        pay() {}
    };
}
