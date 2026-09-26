import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface TransferFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class TransferFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<TransferFateProperties, EventName.OnMoveFate, C> {
    name = 'takeFate';
    eventName = EventName.OnMoveFate;
    defaultProperties: TransferFateProperties = { amount: 1 };

    constructor(propertyFactory: TransferFateProperties | ((context: C) => TransferFateProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['take {1} fate from {0}', [properties.target, properties.amount]];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        const amount = properties.amount ?? 0;
        return (
            !!player.opponent &&
            amount > 0 &&
            player.fate >= amount &&
            super.canAffect(player, context)
        );
    }

    addPropertiesToEvent(event: PlayerEvent<EventName.OnMoveFate, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.fate = amount ?? 0;
        event.origin = player;
        event.recipient = player.opponent;
    }

    checkEventCondition(event: ActionEvent<EventName.OnMoveFate, C>): boolean {
        return this.moveFateEventCondition(event);
    }

    eventHandler(event: ActionEvent<EventName.OnMoveFate, C>): void {
        this.moveFateEventHandler(event);
    }
}
