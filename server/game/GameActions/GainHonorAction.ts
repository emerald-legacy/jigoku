import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';
import type { ActionEvent } from './GameAction.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToStatusToken?: boolean;
}

export class GainHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<GainHonorProperties, EventName.OnModifyHonor, C> {
    defaultProperties: GainHonorProperties = { amount: 1, dueToStatusToken: false };

    name: string = 'gainHonor';
    eventName = EventName.OnModifyHonor;

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        var [_, amountToTransfer] = CalculateHonorLimit(
            context.player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount ?? 0
        );
        return ['gain ' + amountToTransfer + ' honor', []];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
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

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount ?? 0;
        event.dueToStatusToken = dueToStatusToken;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyHonor, C>): void {
        const context = event.context;
        const player = event.player;
        var [_, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            event.amount
        );
        player.modifyHonor(amountToTransfer);
        if(amountToTransfer && context?.game) {
            context.game.addAnimation({ type: 'honor', playerName: player.name, amount: amountToTransfer });
        }
    }
}
