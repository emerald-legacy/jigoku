import { Event } from './Event.js';
import { EventName } from '../Constants.js';

class InitiateCardAbilityEvent extends Event {
    cardTargets: unknown[];
    ringTargets: unknown[];
    selectTargets: unknown[];
    tokenTargets: unknown[];
    allTargets: unknown[];

    constructor(params: Record<string, unknown>, handler?: (event: Event) => void) {
        super(EventName.OnInitiateAbilityEffects, params, handler);
        const ctx = this.context;
        if(ctx && !(ctx.ability as { doesNotTarget?: boolean })?.doesNotTarget) {
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
        this.allTargets = this.cardTargets.concat(this.ringTargets, this.selectTargets, this.tokenTargets);
    }
}

export default InitiateCardAbilityEvent;
