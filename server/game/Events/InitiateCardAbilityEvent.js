const { Event } = require('./Event.js');
const { EventNames } = require('../Constants');

class InitiateCardAbilityEvent extends Event {
    constructor(params, handler) {
        super(EventNames.OnInitiateAbilityEffects, params, handler);
        if(!this.context.ability.doesNotTarget) {
            this.cardTargets = Object.values(this.context.targets).flat();
            this.ringTargets = Object.values(this.context.rings).flat();
            this.selectTargets = Object.values(this.context.selects).flat();
            this.tokenTargets = Object.values(this.context.tokens).flat();
        } else {
            this.cardTargets = [];
            this.ringTargets = [];
            this.selectTargets = [];
            this.tokenTargets = [];
        }
        this.allTargets = this.cardTargets.concat(this.ringTargets, this.selectTargets, this.tokenTargets);
    }
}

module.exports = InitiateCardAbilityEvent;
