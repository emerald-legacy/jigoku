import type { ActionOverrides } from './GameAction.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { GameAction, GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface JointGameProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class JointGameAction<Context extends AbilityContext = AbilityContext> extends CompositeGameAction<JointGameProperties, Context> {
    override effect = 'do several things';
    protected override requiresAll = true;

    constructor(gameActions: GameAction<GameActionProperties, EventName, Context>[]) {
        super({ gameActions: gameActions });
    }

    protected children(properties: JointGameProperties) {
        return properties.gameActions;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        if(this.hasLegalTarget(context, additionalProperties)) {
            for(const gameAction of properties.gameActions) {
                gameAction.addEventsToArray(events, context, overrides);
            }
        }
    }
}
