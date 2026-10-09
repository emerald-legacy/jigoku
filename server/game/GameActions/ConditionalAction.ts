import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import { noAction } from './HandlerAction.js';

export interface ConditionalProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    condition: ((context: C, properties: ConditionalProperties<C>) => boolean) | boolean;
    trueGameAction: GameAction;
    /** Defaults to doing nothing. */
    falseGameAction?: GameAction;
}

export class ConditionalAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<ConditionalProperties<C>, C, 'falseGameAction'> {
    defaultProperties = { falseGameAction: noAction() };

    protected children(properties: ConditionalProperties<C>) {
        return [properties.trueGameAction, properties.falseGameAction];
    }

    /** Only the branch the condition picks. */
    protected resolving(context: C, additionalProperties: ActionOverrides = {}): GameAction[] {
        return [this.getGameAction(context, additionalProperties)];
    }

    getGameAction(context: C, additionalProperties: ActionOverrides = {}): GameAction {
        const properties = this.getProperties(context, additionalProperties);
        let condition = properties.condition;
        if(typeof condition === 'function') {
            condition = condition(context, properties);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    getEffectMessage(context: C): MessageArgs {
        return this.getGameAction(context).getEffectMessage(context);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        this.getGameAction(context, additionalProperties).addEventsToArray(events, context, additionalProperties);
    }
}
