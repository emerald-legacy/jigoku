import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import type CardAbility from '../CardAbility.js';
import type DrawCard from '../DrawCard.js';
import type { Event } from '../Events/Event.js';
import AbilityResolver from '../gamesteps/AbilityResolver.js';
import type Player from '../Player.js';
import TriggeredAbility from '../TriggeredAbility.js';
import { CardGameAction, type CardActionProperties } from './CardGameAction.js';
import type { EventName } from '../Constants.js';
import type { ActionEvent } from './GameAction.js';

export interface TriggerAbilityProperties extends CardActionProperties {
    ability: CardAbility;
    subResolution?: boolean;
    ignoredRequirements?: string[];
    player?: Player;
    event?: Event;
}

export class TriggerAbilityAction<C extends AbilityContext = AbilityContext> extends CardGameAction<TriggerAbilityProperties, EventName.Unnamed, C> {
    name = 'triggerAbility';
    defaultProperties: Partial<TriggerAbilityProperties> = {
        ignoredRequirements: [],
        subResolution: false
    };

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['resolve {0}\'s {1} ability', [properties.target, properties.ability.title]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        let ability = properties.ability;
        let player = properties.player || context.player;
        if(
            !super.canAffect(card, context) ||
            !ability ||
            (!properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier))
        ) {
            return false;
        }
        let newContext = this.triggeredAbilityContext(properties, context);
        let ignoredRequirements = (properties.ignoredRequirements ?? []).concat('player', 'location', 'limit');
        return !ability.meetsRequirements(newContext, ignoredRequirements);
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown> = {}): void {
        let properties = this.getProperties(event.context, additionalProperties);
        let newContext = this.triggeredAbilityContext(properties, event.context);
        newContext.subResolution = !!properties.subResolution;
        if(properties.subResolution) {
            newContext.originatingContext = event.context.triggeringContext;
        }
        event.context.game.queueStep(new AbilityResolver(event.context.game, newContext));
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        let properties = this.getProperties(context);
        return (
            properties.ability &&
            properties.ability.hasTargetsChosenByInitiatingPlayer &&
            properties.ability.hasTargetsChosenByInitiatingPlayer(this.triggeredAbilityContext(properties, context))
        );
    }

    private triggeredAbilityContext(properties: TriggerAbilityProperties, context: C) {
        const ability = properties.ability;
        const player = properties.player || context.player;
        return ability instanceof TriggeredAbility ? ability.createContext(player, properties.event) : ability.createContext(player);
    }
}
