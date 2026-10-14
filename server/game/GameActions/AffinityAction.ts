import { CompositeGameAction } from './CompositeGameAction.js';
import { msg } from '../GameChat.js';
import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameAction, GameActionProperties } from './GameAction.js';

export interface AffinityProperties<C extends AbilityContext = AbilityContext> extends GameActionProperties {
    gameAction: GameAction;
    chatText?(context: C): MessageArgs;
    trait: string;
    noAffinityGameAction?: GameAction;
    activePromptTitle?: string;
}

export class AffinityAction<C extends AbilityContext = AbilityContext> extends CompositeGameAction<AffinityProperties, C> {
    protected children(properties: AffinityProperties) {
        return [properties.gameAction, properties.noAffinityGameAction];
    }

    /** With the affinity its game action, without it the other one (if any). */
    protected resolving(context: C, properties: AffinityProperties): GameAction[] {
        const action = context.player.hasAffinity(properties.trait, context) ? properties.gameAction : properties.noAffinityGameAction;
        return action ? [action] : [];
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.getEffectMessage(context, overrides);
        }

        return properties.noAffinityGameAction?.getEffectMessage(context, overrides) ?? ['', []];
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const { properties, overrides } = this.getCompositeProperties(context, additionalProperties);
        if(!context.player.hasAffinity(properties.trait, context)) {
            return properties.noAffinityGameAction?.addEventsToArray(events, context, overrides);
        }

        if(!properties.activePromptTitle) {
            return this.#resolveAffinity(properties, events, context, overrides);
        }

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.activePromptTitle,
            source: context.source,
            options: [
                { text: 'Yes', handler: () => this.#resolveAffinity(properties, events, context, overrides) },
                { text: 'No', handler: () => {} }
            ]
        });
    }

    #resolveAffinity(
        properties: AffinityProperties,
        events: Event[],
        context: C,
        overrides: ActionOverrides
    ) {
        properties.gameAction.addEventsToArray(events, context, overrides);
        const chatText = properties.chatText ? properties.chatText(context) : properties.gameAction.getEffectMessage(context, overrides);
        context.game.addMessage(msg`${context.player} channels their ${properties.trait} affinity to ${context.game.gameChat.nested(chatText)}`);
    }
}
