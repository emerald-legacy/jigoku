import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, targetList, type GameActionProperties, type GameActionTarget, type ActionEvent } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

export interface HandlerProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    /** `targets` are what the action resolved for, such as the card a `selectCard` chose. */
    handler?: (context: C, targets: GameActionTarget[]) => void;
    hasTargetsChosenByInitiatingPlayer?: boolean;
}

export class HandlerAction<C extends AbilityContext = AbilityContext> extends GameAction<HandlerProperties<C>, EventName.Unnamed, C, 'handler' | 'hasTargetsChosenByInitiatingPlayer'> {
    defaultProperties = {
        handler: () => true,
        hasTargetsChosenByInitiatingPlayer: false
    };

    hasLegalTarget(_context: C): boolean {
        return true;
    }

    canAffect(_target: GameObject, _context: C): boolean {
        return true;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        properties.handler(event.context, targetList(properties.target));
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        return this.getProperties(context, additionalProperties).hasTargetsChosenByInitiatingPlayer;
    }
}
