import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface MultipleActionProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class MultipleGameAction<C extends AbilityContext = AbilityContext> extends GameAction<MultipleActionProperties, EventName, C> {
    declare defaultProperties: MultipleActionProperties;

    constructor(gameActions: GameAction[]) {
        super({ gameActions: gameActions });
    }

    getEffectMessage(context: C): MessageArgs {
        let { gameActions } = this.getProperties(context);
        let legalGameActions = gameActions.filter((action) => action.hasLegalTarget(context));
        let message = '{0}';
        for(var i = 1; i < legalGameActions.length; i++) {
            message += i === legalGameActions.length - 1 ? ' and ' : ', ';
            message += '{' + i + '}';
        }
        return [message, legalGameActions.map((action) => action.getEffectMessage(context))];
    }

    getProperties(context: C, additionalProperties = {}): MultipleActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            gameAction.setDefaultTarget(() => properties.target);
        }
        return properties;
    }

    hasLegalTarget(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.hasLegalTarget(context, additionalProperties));
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.canAffect(target, context, additionalProperties));
    }

    allTargetsLegal(context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.gameActions.some((gameAction) => gameAction.hasLegalTarget(context, additionalProperties));
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, additionalProperties)) {
                    gameAction.addEventsToArray(events, context, additionalProperties);
                }
            });
        }
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        let properties = this.getProperties(context);
        return properties.gameActions.some((gameAction) => gameAction.hasTargetsChosenByInitiatingPlayer(context));
    }
}
