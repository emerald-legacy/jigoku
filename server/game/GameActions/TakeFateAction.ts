import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface TransferFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class TakeFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<TransferFateProperties, EventName.OnMoveFate, C, 'amount'> {
    name = 'takeFate';
    eventName = EventName.OnMoveFate;
    defaultProperties = { amount: 1 };

    getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    protected effectMessage(context: C): MessageArgs {
        return ['take {1} fate from {0}', [this.getProperties(context).amount]];
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { amount } = this.getProperties(context, additionalProperties);
        return (
            !!player.opponent &&
            amount > 0 &&
            player.fate >= amount &&
            super.canAffect(player, context)
        );
    }

    addPropertiesToEvent(event: PlayerEvent<EventName.OnMoveFate, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.fate = amount;
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
