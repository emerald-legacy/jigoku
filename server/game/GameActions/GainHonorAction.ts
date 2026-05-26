import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainHonorAction extends PlayerAction<GainHonorProperties> {
    defaultProperties: GainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context);
        var [_, amountToTransfer] = CalculateHonorLimit(
            context.player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount ?? 0
        );
        return ['gain ' + amountToTransfer + ' honor', []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        var wouldGainAnyHonor = properties.amount !== 0;

        if(!wouldGainAnyHonor) {
            return false;
        }

        var [hasHonorLimit, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount ?? 0
        );

        if(hasHonorLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: any, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: any): void {
        var [_, amountToTransfer] = CalculateHonorLimit(
            event.player,
            event.context.game.roundNumber,
            event.context.game.currentPhase,
            event.amount
        );
        event.player.modifyHonor(amountToTransfer);
        if(amountToTransfer && event.context?.game) {
            event.context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: amountToTransfer });
        }
    }
}
