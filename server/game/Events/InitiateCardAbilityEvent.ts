import { Event } from './Event.js';
import type BaseCard from '../BaseCard.js';
import { EventName } from '../Constants.js';
import type Ring from '../Ring.js';
import type { SelectChoice } from '../AbilityTargets/SelectChoice.js';
import type { StatusToken } from '../StatusToken.js';

class InitiateCardAbilityEvent extends Event {
    cardTargets: BaseCard[];
    ringTargets: Ring[];
    selectTargets: SelectChoice[];
    tokenTargets: StatusToken[];
    allTargets: Array<BaseCard | Ring | SelectChoice | StatusToken>;

    constructor(params: Record<string, unknown>, handler?: (event: Event) => void) {
        super(EventName.OnInitiateAbilityEffects, params, handler);
        const ctx = this.context;
        if(ctx && !ctx.ability?.doesNotTarget) {
            this.cardTargets = Object.values(ctx.targets).flat();
            this.ringTargets = Object.values(ctx.rings).flat();
            this.selectTargets = Object.values(ctx.selects).flat();
            this.tokenTargets = Object.values(ctx.tokens).flat();
        } else {
            this.cardTargets = [];
            this.ringTargets = [];
            this.selectTargets = [];
            this.tokenTargets = [];
        }
        this.allTargets = [...this.cardTargets, ...this.ringTargets, ...this.selectTargets, ...this.tokenTargets];
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
