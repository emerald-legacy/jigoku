import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface OptionalProperties extends GameActionProperties {
    gameAction: GameAction;
    effect?: string;
    effectArgs?: Derivable<MsgArg[], AbilityContext>;
    prompt: string;
    showMessageOnNo?: boolean;
}

export class OptionalAction<C extends AbilityContext = AbilityContext> extends GameAction<OptionalProperties, EventName, C> {
    getProperties(context: C, additionalProperties: ActionOverrides = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => [properties.gameAction]);
    }

    getEffectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context);
    }

    hasLegalTarget(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasLegalTarget(context, additionalProperties);
    }

    canAffect(target: GameObject, context: C, additionalProperties: ActionOverrides = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties: ActionOverrides = {}): void {
        const properties = this.getProperties(context, additionalProperties);

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.prompt,
            source: context.source,
            options: [
                { text: 'Yes', handler: () => this.resolveAction(properties, events, context, additionalProperties) },
                { text: 'No', handler: () => this.skipAction(properties, context) }
            ]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties: ActionOverrides = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }

    resolveAction(
        properties: OptionalProperties,
        events: Event[],
        context: C,
        additionalProperties: ActionOverrides = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, additionalProperties);
        const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
        const nextArg = args.length;
        const msg = `{${nextArg}} chooses to ${properties.effect ?? ''}`;
        context.game.addMessage(msg, ...args, context.player);
    }

    skipAction(
        properties: OptionalProperties,
        context: C
    ) {
        if(properties.showMessageOnNo) {
            const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
            const nextArg = args.length;
            const msg = `{${nextArg}} chooses not to ${properties.effect ?? ''}`;
            context.game.addMessage(msg, ...args, context.player);
        }
    }
}
