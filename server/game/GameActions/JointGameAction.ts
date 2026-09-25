import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface JointGameProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class JointGameAction<C extends AbilityContext = AbilityContext> extends GameAction<JointGameProperties, EventName, C> {
    effect = 'do several things';
    declare defaultProperties: JointGameProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions });
    }

    getProperties(context: C, additionalProperties = {}): JointGameProperties {
        let properties = super.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.every((gameAction) => gameAction.hasLegalTarget(context, additionalProperties));
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.every((gameAction) =>
            gameAction.canAffect(target, context, additionalProperties)
        );
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if(this.hasLegalTarget(context, additionalProperties)) {
            for(const gameAction of properties.gameActions) {
                gameAction.addEventsToArray(events, context, additionalProperties);
            }
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        let properties = this.getProperties(context);
        return properties.gameActions.some((gameAction) => gameAction.hasTargetsChosenByInitiatingPlayer(context));
    }
}
