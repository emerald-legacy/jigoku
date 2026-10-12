import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { EventName } from '../Constants.js';
import { GameAction, joinEffectMessages, type GameActionProperties } from './GameAction.js';

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
        const legal = gameActions.filter((action) => action.hasLegalTarget(context, overrides));
        return joinEffectMessages(context, legal.map((action) => ({ action, overrides })));
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
