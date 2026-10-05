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

interface AbilityToResolve {
    ability: CardAbility;
    subResolution?: boolean;
    player?: Player;
    event?: Event;
}

export function abilityContext(properties: AbilityToResolve, context: AbilityContext) {
    const ability = properties.ability;
    const player = properties.player || context.player;
    return ability instanceof TriggeredAbility ? ability.createContext(player, properties.event) : ability.createContext(player);
}

export function canResolveAbility(properties: AbilityToResolve, context: AbilityContext, ignoredRequirements: string[]): boolean {
    const ability = properties.ability;
    const player = properties.player || context.player;
    if(!ability || (!properties.subResolution && player.isAbilityAtMax(ability.maxIdentifier))) {
        return false;
    }
    return !ability.meetsRequirements(abilityContext(properties, context), ignoredRequirements);
}

export class TriggerAbilityAction<C extends AbilityContext = AbilityContext> extends CardGameAction<TriggerAbilityProperties, EventName.Unnamed, C, 'ignoredRequirements' | 'subResolution'> {
    name = 'triggerAbility';
    defaultProperties = {
        ignoredRequirements: [],
        subResolution: false
    };

    protected effectMessage(context: C): MessageArgs {
        return ['resolve {0}\'s {1} ability', [this.getProperties(context).ability.title]];
    }

    canAffect(card: DrawCard, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return (
            super.canAffect(card, context) &&
            canResolveAbility(properties, context, properties.ignoredRequirements.concat('player', 'location', 'limit'))
        );
    }

    eventHandler(event: ActionEvent<EventName, C>, additionalProperties: Record<string, unknown> = {}): void {
        const properties = this.getProperties(event.context, additionalProperties);
        const newContext = abilityContext(properties, event.context);
        newContext.subResolution = properties.subResolution;
        if(properties.subResolution) {
            newContext.originatingContext = event.context.triggeringContext;
        }
        event.context.game.queueStep(new AbilityResolver(event.context.game, newContext));
    }

    hasTargetsChosenByInitiatingPlayer(context: C) {
        const properties = this.getProperties(context);
        return (
            properties.ability &&
            properties.ability.hasTargetsChosenByInitiatingPlayer &&
            properties.ability.hasTargetsChosenByInitiatingPlayer(abilityContext(properties, context))
        );
    }
}
