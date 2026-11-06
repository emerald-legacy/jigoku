import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { EventName } from '../Constants.js';
import { type GameAction, joinEffectMessages, type GameActionProperties } from './GameAction.js';

interface MultipleProperties extends GameActionProperties {
    gameActions: GameAction[];
}

/** The actions it holds: a list, or a function of the context returning one. */
export type GameActionList<Context extends AbilityContext> = GameAction<GameActionProperties, EventName, Context>[] | ((context: Context) => GameAction[]);

export class MultipleGameAction<Context extends AbilityContext = AbilityContext> extends CompositeGameAction<MultipleProperties, Context> {
    constructor(gameActions: GameActionList<Context>) {
        super(typeof gameActions === 'function' ? (context: Context) => ({ gameActions: gameActions(context) }) : { gameActions });
    }

    override getEffectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties: { gameActions }, overrides } = this.getCompositeProperties(context, additionalProperties);
        const legal = gameActions.filter((action) => action.hasLegalTarget(context, overrides));
        return joinEffectMessages(context, legal.map((action) => ({ action, overrides })));
    }

    protected children(properties: MultipleProperties) {
        return properties.gameActions;
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
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
