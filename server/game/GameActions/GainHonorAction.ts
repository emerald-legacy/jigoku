import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainHonorAction extends PlayerAction<GainHonorProperties> {
    defaultProperties: GainHonorProperties = { amount: 1 };

    name: string = 'gainHonor';
    eventName = EventNames.OnModifyHonor;

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
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

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: Event): void {
        const context = event.context as AbilityContext;
        var [_, amountToTransfer] = CalculateHonorLimit(
            event.player,
            context.game.roundNumber,
            context.game.currentPhase,
            event.amount
        );
        event.player.modifyHonor(amountToTransfer);
        if(amountToTransfer && context?.game) {
            context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: amountToTransfer });
        }
    }
}
