import BaseCardSelector from './BaseCardSelector.js';

class RingSelector extends BaseCardSelector {
    ringCondition: (ring: any, context: any) => boolean;
    gameAction: any;

    constructor(properties: any) {
        super(properties);
        this.ringCondition = properties.ringCondition;
        this.gameAction = properties.gameAction;
    }

    hasEnoughTargets(context: any): boolean {
        return Object.values(context.game.rings).some((ring: any) => this.ringCondition(ring, context));
    }

    defaultActivePromptTitle(): string {
        return 'Choose a ring';
    }
}

export default RingSelector;
