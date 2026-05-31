import { Event } from './Event.js';
import { EventNames } from '../Constants.js';

class InitiateCardAbilityEvent extends Event {
    cardTargets: any[];
    ringTargets: any[];
    selectTargets: any[];
    tokenTargets: any[];
    allTargets: any[];

    constructor(params: any, handler?: (event: any) => void) {
        super(EventNames.OnInitiateAbilityEffects, params, handler);
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
