import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EffectName, EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';
import type { ActionEvent } from './GameAction.js';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean;
}

export class TakeHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<TransferHonorProperties, EventName.OnTransferHonor, C, 'amount' | 'afterBid'> {
    name = 'takeHonor';
    restriction = RestrictionType.TakeHonor;
    eventName = EventName.OnTransferHonor;
    defaultProperties = { amount: 1, afterBid: false };

    getAmountToTransfer(givingPlayer: Player, receivingPlayer: Player, context: C, baseAmount: number) {
        let amount = baseAmount;
        const modifyGivenAmount = givingPlayer
            .getEffects(EffectName.ModifyHonorTransferGiven)
            .reduce((a, b) => a + b, 0);
        const modifyReceivedAmount = receivingPlayer
            .getEffects(EffectName.ModifyHonorTransferReceived)
            .reduce((a, b) => a + b, 0);
        amount = amount + modifyGivenAmount + modifyReceivedAmount;

        const [, amountToTransfer] = CalculateHonorLimit(
            receivingPlayer,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        return amountToTransfer;
    }

    getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['giving {1} honor to {2}', [0, null]];
        }
        const amountToTransfer = this.getAmountToTransfer(context.player, opponent, context, properties.amount);
        return ['giving {1} honor to {2}', [amountToTransfer, opponent]];
    }

    protected effectMessage(context: C): MessageArgs {
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['take {1} honor from {0}', [0]];
        }
        const amountToTransfer = this.getAmountToTransfer(opponent, context.player, context, this.getProperties(context).amount);
        return ['take {1} honor from {0}', [amountToTransfer]];
    }

    protected effectMessageTarget(context: C): MsgArg {
        return context.player.opponent ?? null;
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const { amount } = this.getProperties(context, additionalProperties);
        const gainsHonor = amount > 0;
        if(!gainsHonor) {
            return false;
        }
        const opponent = player.opponent;
        if(!opponent) {
            return false;
        }

        const [hasLimit] = CalculateHonorLimit(
            opponent,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        const amountToTransfer = this.getAmountToTransfer(player, opponent, context, amount);
        if(hasLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnTransferHonor, C>, player: Player, context: C, additionalProperties: Record<string, unknown>): void {
        const { afterBid, amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.afterBid = afterBid;
    }

    eventHandler(event: ActionEvent<EventName.OnTransferHonor, C>): void {
        const player = event.player;
        const opponent = player.opponent;
        if(!opponent) {
            return;
        }
        const amountToTransfer = this.getAmountToTransfer(player, opponent, event.context, event.amount);
        player.modifyHonor(-amountToTransfer);
        opponent.modifyHonor(amountToTransfer);
        if(amountToTransfer) {
            event.context.game.addAnimation({ type: 'honor', playerName: player.name, amount: -amountToTransfer });
            event.context.game.addAnimation({ type: 'honor', playerName: opponent.name, amount: amountToTransfer });
        }
    }
}
