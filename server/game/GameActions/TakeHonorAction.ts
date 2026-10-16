import type { ActionOverrides } from './GameAction.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { calculateHonorLimit } from './Shared/HonorLogic.js';
import type { ActionEvent } from './GameAction.js';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean;
}

export class TakeHonorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<TransferHonorProperties, EventName.OnTransferHonor, Context, 'amount' | 'afterBid'> {
    override name = 'takeHonor';
    override restriction = RestrictionType.TakeHonor;
    override eventName = EventName.OnTransferHonor;
    override defaultProperties = { amount: 1, afterBid: false };

    override defaultTargets(context: Context): Player[] {
        return this.opponentTargets(context);
    }

    getAmountToTransfer(receivingPlayer: Player, context: Context, amount: number) {
        const [, amountToTransfer] = calculateHonorLimit(
            receivingPlayer,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        return amountToTransfer;
    }

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['giving {1} honor to {2}', [0, null]];
        }
        const amountToTransfer = this.getAmountToTransfer(opponent, context, properties.amount);
        return ['giving {1} honor to {2}', [amountToTransfer, opponent]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['take {1} honor from {0}', [0]];
        }
        const amountToTransfer = this.getAmountToTransfer(context.player, context, this.getProperties(context, additionalProperties).amount);
        return ['take {1} honor from {0}', [amountToTransfer]];
    }

    protected override effectMessageTarget(context: Context): MsgArg {
        return context.player.opponent ?? null;
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const { amount } = this.getProperties(context, additionalProperties);
        const gainsHonor = amount > 0;
        if(!gainsHonor) {
            return false;
        }
        const opponent = player.opponent;
        if(!opponent) {
            return false;
        }

        const [hasLimit] = calculateHonorLimit(
            opponent,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        const amountToTransfer = this.getAmountToTransfer(opponent, context, amount);
        if(hasLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnTransferHonor, Context>, player: Player, context: Context, additionalProperties: Record<string, unknown>): void {
        const { afterBid, amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.afterBid = afterBid;
    }

    override eventHandler(event: ActionEvent<EventName.OnTransferHonor, Context>): void {
        const player = event.player;
        const opponent = player.opponent;
        if(!opponent) {
            return;
        }
        const amountToTransfer = this.getAmountToTransfer(opponent, event.context, event.amount);
        player.modifyHonor(-amountToTransfer);
        opponent.modifyHonor(amountToTransfer);
        if(amountToTransfer && event.afterBid) {
            event.context.game.addMessage(msg`${player} gives ${opponent} ${amountToTransfer} honor`);
        }
        if(amountToTransfer) {
            event.context.game.addAnimation({ type: 'honor', playerName: player.name, amount: -amountToTransfer });
            event.context.game.addAnimation({ type: 'honor', playerName: opponent.name, amount: amountToTransfer });
        }
    }
}
