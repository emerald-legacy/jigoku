import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Ring from '../Ring.js';
import BaseCardSelector, { type BaseCardSelectorProperties } from './BaseCardSelector.js';

interface RingSelectorProperties extends BaseCardSelectorProperties {
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    gameAction?: GameAction;
}

class RingSelector extends BaseCardSelector {
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
    gameAction?: GameAction;

    constructor(properties: RingSelectorProperties) {
        super(properties);
        this.ringCondition = properties.ringCondition;
        this.gameAction = properties.gameAction;
    }

    hasEnoughTargets(context: AbilityContext): boolean {
        return Object.values(context.game.rings).some((ring: Ring) => this.ringCondition(ring, context));
    }

    defaultActivePromptTitle(): string {
        return 'Choose a ring';
    }
}

export default RingSelector;
