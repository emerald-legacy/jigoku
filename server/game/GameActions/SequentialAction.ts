import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { GameObject } from '../GameObject.js';
import type { EventName } from '../Constants.js';

export interface SequentialProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class SequentialAction<C extends AbilityContext = AbilityContext> extends GameAction<SequentialProperties, EventName, C> {
    declare defaultProperties: SequentialProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions });
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = super.getProperties(context);
        return properties.gameActions[0].getEffectMessage(context);
    }

    getProperties(context: C, additionalProperties = {}): SequentialProperties {
        let properties = super.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        let { gameActions } = this.getProperties(context, additionalProperties);
        return gameActions.some((gameAction) => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, additionalProperties)) {
                    let eventsForThisAction: Event[] = [];
                    gameAction.addEventsToArray(eventsForThisAction, context, additionalProperties);
                    context.game.queueSimpleStep(() => {
                        for(const event of eventsForThisAction) {
                            events.push(event);
                        }
                        if(gameAction !== properties.gameActions[properties.gameActions.length - 1]) {
                            context.game.openThenEventWindow(eventsForThisAction);
                        }
                    });
                }
            });
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: Record<string, unknown> = {}) {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) =>
            gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
