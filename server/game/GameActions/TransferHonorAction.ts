import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EffectName, EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';

export interface TransferHonorProperties extends PlayerActionProperties {
    amount?: number;
    afterBid?: boolean;
}

export class TransferHonorAction extends PlayerAction {
    name = 'takeHonor';
    eventName = EventName.OnTransferHonor;
    defaultProperties: TransferHonorProperties = { amount: 1, afterBid: false };

    getAmountToTransfer(givingPlayer: Player, receivingPlayer: Player, context: AbilityContext, baseAmount: number) {
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

    constructor(propertyFactory: TransferHonorProperties | ((context: AbilityContext) => TransferHonorProperties)) {
        super(propertyFactory);
    }

    getCostMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
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

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context) as TransferHonorProperties;
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

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as TransferHonorProperties;

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

    addPropertiesToEvent(event: GameEvent<EventName.OnTransferHonor>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let { afterBid, amount } = this.getProperties(context, additionalProperties) as TransferHonorProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.afterBid = afterBid;
    }

    eventHandler(event: GameEvent<EventName.OnTransferHonor>): void {
        var amountToTransfer = this.getAmountToTransfer(
            event.player as Player,
            (event.player as Player).opponent as Player,
            event.context as AbilityContext,
            event.amount ?? 0
        );

        if(event.player && event.player.opponent) {
            event.player.modifyHonor(-amountToTransfer);
            event.player.opponent.modifyHonor(amountToTransfer);
            if(amountToTransfer && event.context?.game) {
                event.context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: -amountToTransfer });
                event.context.game.addAnimation({ type: 'honor', playerName: event.player.opponent.name, amount: amountToTransfer });
            }
        }
    }
}
