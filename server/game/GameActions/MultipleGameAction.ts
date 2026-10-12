import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { EventName } from '../Constants.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface MultipleProperties extends GameActionProperties {
    gameActions: GameAction[];
}

/** The actions it holds: a list, or a function of the context returning one. */
export type GameActionList<C extends AbilityContext> = GameAction<GameActionProperties, EventName, C>[] | ((context: C) => GameAction[]);

export class MultipleGameAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<MultipleProperties, C> {
    constructor(gameActions: GameActionList<C>) {
        super(typeof gameActions === 'function' ? (context: C) => ({ gameActions: gameActions(context) }) : { gameActions });
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties: { gameActions }, overrides } = this.getCompositeProperties(context, additionalProperties);
        const legalGameActions = gameActions.filter((action) => action.hasLegalTarget(context, overrides));
        let message = '{0}';
        for(let i = 1; i < legalGameActions.length; i++) {
            message += i === legalGameActions.length - 1 ? ' and ' : ', ';
            message += '{' + i + '}';
        }
        return [message, legalGameActions.map((action) => context.game.gameChat.nested(action.getEffectMessage(context, overrides)))];
    }

    protected children(properties: MultipleProperties) {
        return properties.gameActions;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        for(const gameAction of properties.gameActions) {
            context.game.queueSimpleStep(() => {
                if(gameAction.hasLegalTarget(context, overrides)) {
                    gameAction.addEventsToArray(events, context, overrides);
                }
            });
        }
    }
}
