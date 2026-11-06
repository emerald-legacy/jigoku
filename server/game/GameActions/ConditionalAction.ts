import type { ActionOverrides, WithDefaults } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import type { GameAction, GameActionProperties } from './GameAction.js';
import { noAction } from './HandlerAction.js';

export interface ConditionalProperties<Context extends AbilityContext = AbilityContext> extends GameActionProperties {
    condition: ((context: Context, properties: ConditionalProperties<Context>) => boolean) | boolean;
    trueGameAction: GameAction;
    /** Defaults to doing nothing. */
    falseGameAction?: GameAction;
}

export class ConditionalAction<Context extends AbilityContext = AbilityContext> extends CompositeGameAction<ConditionalProperties<Context>, Context, 'falseGameAction'> {
    override defaultProperties = { falseGameAction: noAction() };

    protected children(properties: ConditionalProperties<Context>) {
        return [properties.trueGameAction, properties.falseGameAction];
    }

    /** Only the branch the condition picks. */
    protected override resolving(context: Context, properties: WithDefaults<ConditionalProperties<Context>, 'falseGameAction'>): GameAction[] {
        return [this.#pick(context, properties)];
    }

    getGameAction(context: Context, additionalProperties: ActionOverrides = {}): GameAction {
        return this.#pick(context, this.getProperties(context, additionalProperties));
    }

    #pick(context: Context, properties: WithDefaults<ConditionalProperties<Context>, 'falseGameAction'>): GameAction {
        let condition = properties.condition;
        if(typeof condition === 'function') {
            condition = condition(context, properties);
        }
        return condition ? properties.trueGameAction : properties.falseGameAction;
    }

    override getEffectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return this.#pick(context, properties).getEffectMessage(context, overrides);
    }

    override addEventsToArray(events: Event[], context: Context, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        this.#pick(context, properties).addEventsToArray(events, context, overrides);
    }
}
