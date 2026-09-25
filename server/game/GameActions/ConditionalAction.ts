import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface ConditionalActionProperties extends GameActionProperties {
    condition: ((context: AbilityContext, properties: ConditionalActionProperties) => boolean) | boolean;
    trueGameAction: GameAction;
    falseGameAction: GameAction;
}

export class ConditionalAction<C extends AbilityContext = AbilityContext> extends GameAction<ConditionalActionProperties, EventName, C> {
    getProperties(context: C, additionalProperties = {}): ConditionalActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        properties.trueGameAction.setDefaultTarget(() => properties.target);
        properties.falseGameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getGameAction(context: C, additionalProperties = {}): GameAction {
        let properties = this.getProperties(context, additionalProperties);
        let condition = properties.condition;
        if(typeof condition === 'function') {
            condition = condition(context, properties);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    getEffectMessage(context: C): MessageArgs {
        return this.getGameAction(context).getEffectMessage(context);
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).canAffect(target, context, additionalProperties);
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        this.getGameAction(context, additionalProperties).addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasTargetsChosenByInitiatingPlayer(
            context,
            additionalProperties
        );
    }
}
