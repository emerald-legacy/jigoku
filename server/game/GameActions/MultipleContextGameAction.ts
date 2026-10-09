import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface MultipleContextProperties extends GameActionProperties {
    gameActions: GameAction[];
}

export class MultipleContextGameAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<MultipleContextProperties, C> {
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

    protected children(properties: MultipleContextProperties) {
        return properties.gameActions;
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
}
