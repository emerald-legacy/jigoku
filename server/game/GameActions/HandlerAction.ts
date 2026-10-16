import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, targetList, type GameActionProperties, type GameActionTarget, type ActionEvent } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { EventName } from '../Constants.js';
import type { GameObject } from '../GameObject.js';

export interface HandlerProperties<Context extends AbilityContext = AbilityContext> extends GameActionProperties {
    /** `targets` are what the action resolved for, such as the card a `selectCard` chose. */
    handler?: (context: Context, targets: GameActionTarget[]) => void;
    hasTargetsChosenByInitiatingPlayer?: boolean;
}

export class HandlerAction<Context extends AbilityContext = AbilityContext> extends GameAction<HandlerProperties<Context>, EventName.Unnamed, Context, 'handler' | 'hasTargetsChosenByInitiatingPlayer'> {
    override defaultProperties = {
        handler: () => true,
        hasTargetsChosenByInitiatingPlayer: false
    };

    override hasLegalTarget(_context: Context): boolean {
        return true;
    }

    override canAffect(_target: GameObject, _context: Context): boolean {
        return true;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    override eventHandler(event: ActionEvent<EventName, Context>, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        properties.handler(event.context, targetList(properties.target));
    }

    override hasTargetsChosenByInitiatingPlayer(context: Context, additionalProperties: ActionOverrides = {}): boolean {
        return this.getProperties(context, additionalProperties).hasTargetsChosenByInitiatingPlayer;
    }
}

/** An action that does nothing, such as the branch of a choice that resolves no effect. */
export function noAction(): GameAction {
    const action = new HandlerAction({});
    action.isNoAction = true;
    return action;
}
