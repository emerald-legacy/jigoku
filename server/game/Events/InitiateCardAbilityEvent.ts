import { Event } from './Event.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';

class InitiateCardAbilityEvent extends Event {
    cardTargets: BaseCard[];
    ringTargets: Ring[];

    constructor(params: Record<string, unknown>, handler?: (event: Event) => void) {
        super(EventName.OnInitiateAbilityEffects, params, handler);
        const ctx = this.context;
        this.cardTargets = ctx ? Object.values(ctx.targets).flat() : [];
        this.ringTargets = ctx ? Object.values(ctx.rings).flat() : [];
        // Record chosen cards on the triggering context, so continuations (sub-resolutions)
        // stay visible to cards reacting to the original triggering.
        const triggeringContext = ctx?.triggeringContext;
        if(triggeringContext) {
            for(const card of this.cardTargets) {
                if(!triggeringContext.chosenCardTargets.includes(card)) {
                    triggeringContext.chosenCardTargets.push(card);
                }
            }
        }
    }
}

export default InitiateCardAbilityEvent;
