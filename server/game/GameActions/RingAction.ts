import type { ActionOverrides } from './GameAction.js';
import type { AbilityContext } from '../AbilityContext.js';
import type Ring from '../Ring.js';
import { GameAction, type GameActionProperties, type ActionEvent } from './GameAction.js';
import { type EventName, ObjectType } from '../Constants.js';

export type RingActionProperties = GameActionProperties;

type RingEvent<EventType extends EventName, Context extends AbilityContext> = ActionEvent<EventType, Context> & { ring: Ring };

export class RingAction<
    Properties extends RingActionProperties = RingActionProperties,
    EventType extends EventName = EventName,
    Context extends AbilityContext = AbilityContext,
    Defaulted extends keyof Properties = never
> extends GameAction<Properties, EventType, Context, Defaulted> {
    override targetType = [ObjectType.Ring];

    override defaultTargets(context: Context): Ring[] {
        return context.game.currentConflict && context.game.currentConflict.ring ? [context.game.currentConflict.ring] : [];
    }

    override checkEventCondition(event: RingEvent<EventType, Context>, additionalProperties: ActionOverrides = {}): boolean {
        return this.canAffect(event.ring, event.context, additionalProperties);
    }

    override addPropertiesToEvent(event: RingEvent<EventType, Context>, ring: Ring, context: Context, additionalProperties: ActionOverrides = {}): void {
        super.addPropertiesToEvent(event, ring, context, additionalProperties);
        event.ring = ring;
    }
}
