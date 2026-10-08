import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import { noAction } from './HandlerAction.js';
import type { EventName } from '../Constants.js';

export interface ConditionalActionProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    condition: ((context: C, properties: ConditionalActionProperties<C>) => boolean) | boolean;
    trueGameAction: GameAction;
    /** Defaults to doing nothing. */
    falseGameAction?: GameAction;
}

export class ConditionalAction<C extends AbilityContext = AbilityContext> extends GameAction<ConditionalActionProperties<C>, EventName, C, 'falseGameAction'> {
    defaultProperties = { falseGameAction: noAction() };

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => [properties.trueGameAction, properties.falseGameAction]);
    }

    getGameAction(context: C, additionalProperties: ActionOverrides = {}): GameAction {
        const properties = this.getProperties(context, additionalProperties);
        let condition = properties.condition;
        if(typeof condition === 'function') {
            condition = condition(context, properties);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    getEffectMessage(context: C): MessageArgs {
        return this.getGameAction(context).getEffectMessage(context);
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.getGameAction(context, additionalProperties).canAffect(target, context, additionalProperties);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasLegalTarget(context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        this.getGameAction(context, additionalProperties).addEventsToArray(events, context, additionalProperties);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}): boolean {
        return this.getGameAction(context, additionalProperties).hasTargetsChosenByInitiatingPlayer(
            context,
            additionalProperties
        );
    }
}
