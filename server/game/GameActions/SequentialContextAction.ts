import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { GameObject } from '../GameObject.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { EventName } from '../Constants.js';

export interface SequentialContextProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class SequentialContextAction<C extends AbilityContext = AbilityContext> extends GameAction<SequentialContextProperties, EventName, C> {
    getEffectMessage(context: C): MessageArgs {
        const properties = super.getProperties(context);
        return properties.gameActions[0].getEffectMessage(context);
    }

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => properties.gameActions);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { gameActions } = this.getProperties(context, additionalProperties);
        return gameActions.some((gameAction) => gameAction.hasLegalTarget(context));
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.canAffect(target, context));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, additionalProperties)) {
                    const eventsForThisAction: Event[] = [];
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

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) =>
            gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties)
        );
    }
}
