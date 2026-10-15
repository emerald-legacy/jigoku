import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { GameAction, GameActionProperties } from './GameAction.js';

export interface IfAbleProperties extends GameActionProperties {
    ifAbleGameAction: GameAction;
    otherwiseGameAction: GameAction;
}

export class IfAbleAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<IfAbleProperties, C> {
    protected children(properties: IfAbleProperties) {
        return [properties.ifAbleGameAction, properties.otherwiseGameAction];
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties: { ifAbleGameAction, otherwiseGameAction }, overrides } = this.getCompositeProperties(context, additionalProperties);
        return ifAbleGameAction.hasLegalTarget(context, overrides)
            ? ifAbleGameAction.getEffectMessage(context, overrides)
            : otherwiseGameAction.getEffectMessage(context, overrides);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}) {
        const { properties: { ifAbleGameAction, otherwiseGameAction }, overrides } = this.getCompositeProperties(context, additionalProperties);
        const gameAction = ifAbleGameAction.hasLegalTarget(context, overrides) ? ifAbleGameAction : otherwiseGameAction;
        gameAction.addEventsToArray(events, context, overrides);
    }
}
