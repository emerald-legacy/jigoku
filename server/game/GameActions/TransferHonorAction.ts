import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EffectName, EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';
import type { ActionEvent } from './GameAction.js';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean;
}

export class TransferHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<TransferHonorProperties, EventName.OnTransferHonor, C> {
    name = 'takeHonor';
    eventName = EventName.OnTransferHonor;
    defaultProperties: TransferHonorProperties = { amount: 1, afterBid: false };

    getAmountToTransfer(givingPlayer: Player, receivingPlayer: Player, context: C, baseAmount: number) {
        let amount = baseAmount;
        const modifyGivenAmount = givingPlayer
            .getEffects(EffectName.ModifyHonorTransferGiven)
            .reduce((a, b) => a + b, 0);
        const modifyReceivedAmount = receivingPlayer
            .getEffects(EffectName.ModifyHonorTransferReceived)
            .reduce((a, b) => a + b, 0);
        amount = amount + modifyGivenAmount + modifyReceivedAmount;

        var [_, amountToTransfer] = CalculateHonorLimit(
            receivingPlayer,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        return amountToTransfer;
    }

    constructor(propertyFactory: TransferHonorProperties | ((context: C) => TransferHonorProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['giving {1} honor to {2}', [0, null]];
        }
        var amountToTransfer = this.getAmountToTransfer(
            context.player,
            opponent,
            context,
            properties.amount ?? 0
        );
        return ['giving {1} honor to {2}', [amountToTransfer, opponent]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        const opponent = context.player.opponent;
        if(!opponent) {
            return ['take {1} honor from {0}', [null, 0]];
        }
        var amountToTransfer = this.getAmountToTransfer(
            opponent,
            context.player,
            context,
            properties.amount ?? 0
        );
        return ['take {1} honor from {0}', [opponent, amountToTransfer]];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);

        const amount = properties.amount ?? 0;
        const gainsHonor = amount > 0;
        if(!gainsHonor) {
            return false;
        }
        const opponent = player.opponent;
        if(!opponent) {
            return false;
        }

        var [hasLimit, amountToTransfer] = CalculateHonorLimit(
            opponent,
            context.game.roundNumber,
            context.game.currentPhase,
            amount
        );
        amountToTransfer = this.getAmountToTransfer(player, opponent, context, amount);
        if(hasLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnTransferHonor, C>, player: Player, context: C, additionalProperties: Record<string, unknown>): void {
        let { afterBid, amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount ?? 0;
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
        if(amountToTransfer && event.context?.game) {
            event.context.game.addAnimation({ type: 'honor', playerName: player.name, amount: -amountToTransfer });
            event.context.game.addAnimation({ type: 'honor', playerName: opponent.name, amount: amountToTransfer });
        }
    }
}
