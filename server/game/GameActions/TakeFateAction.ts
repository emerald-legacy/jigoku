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

export class TakeFateAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<TransferFateProperties, EventName.OnMoveFate, Context, 'amount'> {
    override name = 'takeFate';
    override eventName = EventName.OnMoveFate;
    override defaultProperties = { amount: 1 };

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['giving {1} fate to {2}', [properties.amount, context.player.opponent]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['take {1} fate from {0}', [this.getProperties(context, additionalProperties).amount]];
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount } = this.getProperties(context, additionalProperties);
        return (
            !!player.opponent &&
            amount > 0 &&
            player.fate >= amount &&
            super.canAffect(player, context)
        );
    }

    override addPropertiesToEvent(event: PlayerEvent<EventName.OnMoveFate, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.fate = amount;
        event.origin = player;
        event.recipient = player.opponent;
    }

    override checkEventCondition(event: ActionEvent<EventName.OnMoveFate, Context>): boolean {
        return this.moveFateEventCondition(event);
    }

    override eventHandler(event: ActionEvent<EventName.OnMoveFate, Context>): void {
        this.moveFateEventHandler(event);
    }
}
