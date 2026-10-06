import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';
import type { EventName } from '../Constants.js';

export interface AffinityActionProperties extends GameActionProperties {
    gameAction: GameAction;
    effect?: string;
    effectArgs?: Derivable<MsgArg[], AbilityContext>;
    trait: string;
    noAffinityGameAction?: GameAction;
    promptTitleForConfirmingAffinity?: string;
}

export class AffinityAction<C extends AbilityContext = AbilityContext> extends GameAction<AffinityActionProperties, EventName, C> {
    getProperties(context: C, additionalProperties = {}) {
        return this.getCompositeProperties(context, additionalProperties, (properties) => [properties.gameAction, properties.noAffinityGameAction]);
    }

    getEffectMessage(context: C, additionalProperties = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.getEffectMessage(context);
        }

        return properties.noAffinityGameAction?.getEffectMessage(context) ?? ['', []];
    }

    hasLegalTarget(context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.hasLegalTarget(context, additionalProperties);
        }

        return properties.noAffinityGameAction?.hasLegalTarget(context, additionalProperties) ?? false;
    }

    canAffect(target: GameObject, context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.canAffect(target, context, additionalProperties);
        }

        return properties.noAffinityGameAction?.canAffect(target, context, additionalProperties) ?? false;
    }

    addEventsToArray(events: Event[], context: C, additionalProperties = {}): void {
        const properties = this.getProperties(context, additionalProperties);
        if(!context.player.hasAffinity(properties.trait, context)) {
            return properties.noAffinityGameAction?.addEventsToArray(events, context, additionalProperties);
        }

        if(!properties.promptTitleForConfirmingAffinity) {
            return this.#resolveAffinity(properties, events, context, additionalProperties);
        }

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.promptTitleForConfirmingAffinity,
            source: context.source,
            options: [
                { text: 'Yes', handler: () => this.#resolveAffinity(properties, events, context, additionalProperties) },
                { text: 'No', handler: () => {} }
            ]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: C, additionalProperties = {}) {
        const properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.hasTargetsChosenByInitiatingPlayer(context, additionalProperties);
        }
        return (
            properties.noAffinityGameAction?.hasTargetsChosenByInitiatingPlayer(context, additionalProperties) ?? false
        );
    }

    #resolveAffinity(
        properties: AffinityActionProperties,
        events: Event[],
        context: C,
        additionalProperties = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, additionalProperties);
        if(properties.effect === undefined) {
            // without an effect text, the action's own effect message says what the affinity does
            const effect = context.game.gameChat.nested(properties.gameAction.getEffectMessage(context));
            context.game.addMessage(`{0} channels their ${properties.trait} affinity to {1}`, context.player, effect);
            return;
        }
        const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
        const nextArg = args.length;
        const affinityMsg = `{${nextArg}} channels their ${properties.trait} affinity to ${properties.effect}`;
        context.game.addMessage(affinityMsg, ...args, context.player);
    }
}
