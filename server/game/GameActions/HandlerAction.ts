import type { AbilityContext } from '../AbilityContext.js';
import DrawCard from '../DrawCard.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';

import type { Event } from '../Events/Event.js';
import type { EventName } from '../Constants.js';
export interface HandlerProperties extends GameActionProperties {
    handler?: (context: AbilityContext) => void;
    hasTargetsChosenByInitiatingPlayer?: boolean;
}

export class HandlerAction<C extends AbilityContext = AbilityContext> extends GameAction<HandlerProperties, EventName.Unnamed, C> {
    defaultProperties: HandlerProperties = {
        handler: () => true,
        hasTargetsChosenByInitiatingPlayer: false
    };

    hasLegalTarget(): boolean {
        return true;
    }

    canAffect(_card: DrawCard, _context: AbilityContext): boolean {
        return true;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        properties.handler?.(event.context);
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: Record<string, unknown> = {}): boolean {
        const { hasTargetsChosenByInitiatingPlayer } = this.getProperties(
            context,
            additionalProperties
        );
        return !!hasTargetsChosenByInitiatingPlayer;
    }
}
