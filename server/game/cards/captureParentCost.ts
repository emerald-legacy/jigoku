import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { captureCost } from './captureCost.js';

/** A free cost that records the source's parent character before later costs move the source. */
export function captureParentCost() {
    return captureCost('captureParentCost', (context) => context.source.parentCharacter);
}

/** The parent recorded by `captureParentCost`, or the source's current parent before the costs are paid. */
export function capturedParent(context: { costs: { captureParentCost?: DrawCard | null }; source: BaseCard }): DrawCard | null {
    return context.costs.captureParentCost ?? context.source.parentCharacter;
}
