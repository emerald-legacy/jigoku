import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface ConditionalActionProperties extends GameActionProperties {
    condition: ((context: any, properties: ConditionalActionProperties) => boolean) | boolean;
    trueGameAction: GameAction;
    falseGameAction: GameAction;
}

export class ConditionalAction extends GameAction<ConditionalActionProperties> {
    getProperties(context: AbilityContext, additionalProperties = {}): ConditionalActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        properties.trueGameAction.setDefaultTarget(() => properties.target);
        properties.falseGameAction.setDefaultTarget(() => properties.target);
        return properties;
    }

    getGameAction(context: AbilityContext, additionalProperties = {}): GameAction {
        let properties = this.getProperties(context, additionalProperties);
        let condition = properties.condition;
        if(typeof condition === 'function') {
            condition = condition(context, properties);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        return this.getGameAction(context).getEffectMessage(context);
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).canAffect(target, context, additionalProperties);
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        this.getGameAction(context, additionalProperties).addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasTargetsChosenByInitiatingPlayer(
            context,
            additionalProperties
        );
    }
}
