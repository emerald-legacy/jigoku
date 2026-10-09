import type { ActionOverrides } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface JointGameProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class JointGameAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<JointGameProperties, C> {
    effect = 'do several things';
    protected requiresAll = true;

    constructor(gameActions: GameAction<GameActionProperties, EventName, C>[]) {
        super({ gameActions: gameActions });
    }

    protected children(properties: JointGameProperties) {
        return properties.gameActions;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(this.hasLegalTarget(context, additionalProperties)) {
            for(const gameAction of properties.gameActions) {
                gameAction.addEventsToArray(events, context, additionalProperties);
            }
        }
    }
}
