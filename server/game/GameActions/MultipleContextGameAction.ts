import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface MultipleContextActionProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class MultipleContextGameAction<C extends AbilityContext = AbilityContext> extends GameAction<MultipleContextActionProperties, EventName, C> {
    getEffectMessage(context: C): MessageArgs {
        const { gameActions } = this.getProperties(context);
        const legalGameActions = gameActions.filter((action) => action.hasLegalTarget(context));
        let message = '{0}';
        for(let i = 1; i < legalGameActions.length; i++) {
            message += i === legalGameActions.length - 1 ? ' and ' : ', ';
            message += '{' + i + '}';
        }
        return [message, legalGameActions.map((action) => context.game.gameChat.nested(action.getEffectMessage(context)))];
    }

    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => properties.gameActions);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.hasLegalTarget(context, additionalProperties));
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.canAffect(target, context, additionalProperties));
    }

    allTargetsLegal(context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.hasLegalTarget(context, additionalProperties));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, additionalProperties)) {
                    gameAction.addEventsToArray(events, context, additionalProperties);
                }
            });
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        const properties = this.getProperties(context);
        return properties.gameActions.some((gameAction) => gameAction.hasTargetsChosenByInitiatingPlayer(context));
    }
}
