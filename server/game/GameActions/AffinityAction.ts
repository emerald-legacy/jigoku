import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import type { GameObject } from '../GameObject.js';
import { Derivable, derive } from '../utils/helpers.js';
import { GameAction, type GameActionProperties } from './GameAction.js';

export interface AffinityActionProperties extends GameActionProperties {
    gameAction: GameAction;
    effect?: string;
    effectArgs?: Derivable<Array<unknown>, AbilityContext>;
    trait: string;
    noAffinityGameAction?: GameAction;
    promptTitleForConfirmingAffinity?: string;
}

export class AffinityAction extends GameAction<AffinityActionProperties> {
    getProperties(context: AbilityContext, additionalProperties = {}): AffinityActionProperties {
        let properties = super.getProperties(context, additionalProperties);
        properties.gameAction.setDefaultTarget(() => properties.target);
        properties.noAffinityGameAction?.setDefaultTarget(() => properties.target);
        return properties;
    }

    getEffectMessage(context: AbilityContext, additionalProperties = {}): MessageArgs {
        let properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.getEffectMessage(context);
        }

        return properties.noAffinityGameAction?.getEffectMessage(context) ?? ['', []];
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.hasLegalTarget(context, additionalProperties);
        }

        return properties.noAffinityGameAction?.hasLegalTarget(context, additionalProperties) ?? false;
    }

    canAffect(target: GameObject, context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
        if(context.player.hasAffinity(properties.trait, context)) {
            return properties.gameAction.canAffect(target, context, additionalProperties);
        }

        return properties.noAffinityGameAction?.canAffect(target, context, additionalProperties) ?? false;
    }

    addEventsToArray(events: Event[], context: AbilityContext, additionalProperties = {}): void {
        let properties = this.getProperties(context, additionalProperties);
        if(!context.player.hasAffinity(properties.trait, context)) {
            return properties.noAffinityGameAction?.addEventsToArray(events, context, additionalProperties);
        }

        if(!properties.promptTitleForConfirmingAffinity) {
            return this.#resolveAffinity(properties, events, context, additionalProperties);
        }

        context.player.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: properties.promptTitleForConfirmingAffinity,
            source: context.source,
            choices: ['Yes', 'No'],
            handlers: [() => this.#resolveAffinity(properties, events, context, additionalProperties), () => {}]
        });
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}) {
        let properties = this.getProperties(context, additionalProperties);
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
        context: AbilityContext,
        additionalProperties = {}
    ) {
        properties.gameAction.addEventsToArray(events, context, additionalProperties);
        const args = properties.effectArgs ? derive(properties.effectArgs, context) : [];
        const nextArg = args.length;
        const affinityMsg = `{${nextArg}} channels their ${properties.trait} affinity to ${properties.effect ?? ''}`;
        context.game.addMessage(affinityMsg, ...(args as MsgArg[]), context.player);
    }
}
