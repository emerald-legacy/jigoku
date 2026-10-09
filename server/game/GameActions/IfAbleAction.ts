import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface IfAbleProperties extends GameActionProperties {
    ifAbleAction: GameAction;
    otherwiseAction: GameAction;
}

export class IfAbleAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<IfAbleProperties, C> {
    protected children(properties: IfAbleProperties) {
        return [properties.ifAbleAction, properties.otherwiseAction];
    }

    getEffectMessage(context: C): MessageArgs {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context);
        return ifAbleAction.hasLegalTarget(context)
            ? ifAbleAction.getEffectMessage(context)
            : otherwiseAction.getEffectMessage(context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}) {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        const gameAction = ifAbleAction.hasLegalTarget(context, additionalProperties) ? ifAbleAction : otherwiseAction;
        gameAction.addEventsToArray(events, context, additionalProperties);
    }
}
