import type { AbilityContext } from '../AbilityContext.js';
import DrawCard from '../DrawCard.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

import type { Event } from '../Events/Event.js';
export interface HandlerProperties extends GameActionProperties {
    handler?: (context: AbilityContext) => void;
    hasTargetsChosenByInitiatingPlayer?: boolean;
}

export class HandlerAction extends GameAction<HandlerProperties> {
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

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event: Event, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties((event.context as AbilityContext), additionalProperties) as HandlerProperties;
        properties.handler?.((event.context as AbilityContext));
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties: Record<string, unknown> = {}): boolean {
        const { hasTargetsChosenByInitiatingPlayer } = this.getProperties(
            context,
            additionalProperties
        ) as HandlerProperties;
        return !!hasTargetsChosenByInitiatingPlayer;
    }
}
