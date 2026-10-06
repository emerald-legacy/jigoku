import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface OptionalActionProperties extends GameActionProperties {
    gameAction: GameAction;
    effect?: string;
    effectArgs?: Derivable<MsgArg[], AbilityContext>;
    promptTitleForConfirming: string;
    showMessageOnNo?: boolean;
}

export class OptionalAction<C extends AbilityContext = AbilityContext> extends GameAction<OptionalActionProperties, EventName, C> {
    getProperties(context: C, additionalProperties = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => [properties.gameAction]);
    }

    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.getEffectMessage(context);
    }

    hasLegalTarget(context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasLegalTarget(context, additionalProperties);
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.canAffect(target, context, additionalProperties);
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.promptTitleForConfirming,
            source: context.source,
            options: [
                { text: 'Yes', handler: () => this.resolveAction(properties, events, context, additionalProperties) },
                { text: 'No', handler: () => this.skipAction(properties, context) }
            ]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
    }

    resolveAction(
        properties: OptionalActionProperties,
        events: Event[],
        context: C,
        additionalProperties = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, additionalProperties);
        const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
        const nextArg = args.length;
        const msg = `{${nextArg}} chooses to ${properties.effect ?? ''}`;
        context.game.addMessage(msg, ...args, context.player);
    }

    skipAction(
        properties: OptionalActionProperties,
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
