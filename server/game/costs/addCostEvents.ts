import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type { Cost, Result } from './Cost.js';

/**
 * Adds a cost's events, however the cost pays: `addEventsToArray` adds them at once; otherwise `resolve` runs now and,
 * unless that cancels, a later step adds `payEvent`'s events, or a PayCost event around `pay`.
 */
export function addCostEvents(cost: Cost, events: Event[], context: AbilityContext, result: Result): void {
    if(cost.addEventsToArray) {
        cost.addEventsToArray(events, context, result);
        return;
    }
    cost.resolve?.(context, result);
    context.game.queueSimpleStep(() => {
        if(!result.cancelled) {
            const paid = cost.payEvent ? cost.payEvent(context) : context.game.getEvent(EventName.PayCost, {}, () => cost.pay?.(context));
            events.push(...(Array.isArray(paid) ? paid : [paid]));
        }
    });
}
