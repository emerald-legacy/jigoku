import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface IfAbleActionProperties extends GameActionProperties {
    ifAbleAction: GameAction;
    otherwiseAction: GameAction;
}

export class IfAbleAction<C extends AbilityContext = AbilityContext> extends GameAction<IfAbleActionProperties, EventName, C> {
    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => [properties.ifAbleAction, properties.otherwiseAction]);
    }

    getEffectMessage(context: C): MessageArgs {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context);
        return ifAbleAction.hasLegalTarget(context)
            ? ifAbleAction.getEffectMessage(context)
            : otherwiseAction.getEffectMessage(context);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}) {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return (
            ifAbleAction.hasLegalTarget(context, additionalProperties) ||
            otherwiseAction.hasLegalTarget(context, additionalProperties)
        );
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}) {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return (
            ifAbleAction.canAffect(target, context, additionalProperties) ||
            otherwiseAction.canAffect(target, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}) {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        const gameAction = ifAbleAction.hasLegalTarget(context) ? ifAbleAction : otherwiseAction;
        gameAction.addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}) {
        const { ifAbleAction, otherwiseAction } = this.getProperties(context, additionalProperties);
        return (
            ifAbleAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties) ||
            otherwiseAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
