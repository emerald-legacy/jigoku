import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface TransferFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class TransferFateAction extends PlayerAction {
    name = 'takeFate';
    eventName = EventNames.OnMoveFate;
    defaultProperties: TransferFateProperties = { amount: 1 };

    constructor(propertyFactory: TransferFateProperties | ((context: AbilityContext) => TransferFateProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as TransferFateProperties;
        return ['take {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferFateProperties;
        const amount = properties.amount ?? 0;
        return (
            !!player.opponent &&
            amount > 0 &&
            player.fate >= amount &&
            super.canAffect(player, context)
        );
    }

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties) as TransferFateProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.fate = amount;
        event.origin = player;
        event.recipient = player.opponent;
    }

    checkEventCondition(event: Event): boolean {
        return this.moveFateEventCondition(event);
    }

    eventHandler(event: Event): void {
        this.moveFateEventHandler(event);
    }
}
