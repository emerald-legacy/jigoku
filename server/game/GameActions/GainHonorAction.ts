import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { onlyThePlayer, PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { CalculateHonorLimit } from './Shared/HonorLogic.js';
import { type ActionEvent, targetList } from './GameAction.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToStatusToken?: boolean;
}

export class GainHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<GainHonorProperties, EventName.OnModifyHonor, C, 'amount' | 'dueToStatusToken'> {
    defaultProperties = { amount: 1, dueToStatusToken: false };

    name = 'gainHonor';

    restriction = RestrictionType.GainHonor;
    eventName = EventName.OnModifyHonor;

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        const players = targetList(properties.target);
        // capped by the honor limit of the player who gains it
        const [, amountToTransfer] = CalculateHonorLimit(
            players[0] ?? context.player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount
        );
        return [onlyThePlayer(players, context) ? `gain ${amountToTransfer} honor` : `make {0} gain ${amountToTransfer} honor`, []];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        const players = targetList(this.getProperties(context, additionalProperties).target);
        return onlyThePlayer(players, context) ? undefined : players;
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const wouldGainAnyHonor = properties.amount !== 0;

        if(!wouldGainAnyHonor) {
            return false;
        }

        const [hasHonorLimit, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount
        );

        if(hasHonorLimit && !amountToTransfer) {
            return false;
        }

        return super.canAffect(player, context);
    }


    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.dueToStatusToken = dueToStatusToken;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyHonor, C>): void {
        const context = event.context;
        const player = event.player;
        const [, amountToTransfer] = CalculateHonorLimit(
            player,
            context.game.roundNumber,
            context.game.currentPhase,
            event.amount
        );
        player.modifyHonor(amountToTransfer);
        if(amountToTransfer) {
            context.game.addAnimation({ type: 'honor', playerName: player.name, amount: amountToTransfer });
        }
    }
}
