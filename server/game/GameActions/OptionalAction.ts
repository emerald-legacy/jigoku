import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CompositeGameAction } from './CompositeGameAction.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface OptionalProperties extends GameActionProperties {
    gameAction: GameAction;
    chatText?: string;
    chatTextArgs?: Derivable<MsgArg[], AbilityContext>;
    prompt: string;
    showMessageOnNo?: boolean;
}

export class OptionalAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<OptionalProperties, C> {
    protected children(properties: OptionalProperties) {
        return [properties.gameAction];
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context, overrides);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.prompt,
            source: context.source,
            options: [
                { text: 'Yes', handler: () => this.resolveAction(properties, events, context, overrides) },
                { text: 'No', handler: () => this.skipAction(properties, context) }
            ]
        });
    }

    resolveAction(
        properties: OptionalProperties,
        events: Event[],
        context: C,
        overrides: ActionOverrides = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, overrides);
        const args = properties.chatTextArgs ? derive(properties.chatTextArgs, context) : [];
        const nextArg = args.length;
        const msg = `{${nextArg}} chooses to ${properties.chatText ?? ''}`;
        context.game.addMessage(msg, ...args, context.player);
    }

    skipAction(
        properties: OptionalProperties,
        context: C
    ) {
        if(properties.showMessageOnNo) {
            const args = properties.chatTextArgs ? derive(properties.chatTextArgs, context) : [];
            const nextArg = args.length;
            const msg = `{${nextArg}} chooses not to ${properties.chatText ?? ''}`;
            context.game.addMessage(msg, ...args, context.player);
        }
    }
}
