import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { onlyThePlayer, PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { calculateHonorLimit } from './Shared/HonorLogic.js';
import { type ActionEvent, targetList } from './GameAction.js';

export interface GainHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToStatusToken?: boolean;
}

export class GainHonorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<GainHonorProperties, EventName.OnModifyHonor, Context, 'amount' | 'dueToStatusToken'> {
    override defaultProperties = { amount: 1, dueToStatusToken: false };

    override name = 'gainHonor';

    override restriction = RestrictionType.GainHonor;
    override eventName = EventName.OnModifyHonor;

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const properties = this.getProperties(context, additionalProperties);
        const players = targetList(properties.target);
        // capped by the honor limit of the player who gains it
        const [, amountToTransfer] = calculateHonorLimit(
            players[0] ?? context.player,
            context.game.roundNumber,
            context.game.currentPhase,
            properties.amount
        );
        return [onlyThePlayer(players, context) ? `gain ${amountToTransfer} honor` : `make {0} gain ${amountToTransfer} honor`, []];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        const players = targetList(this.getProperties(context, additionalProperties).target);
        return onlyThePlayer(players, context) ? undefined : players;
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        const wouldGainAnyHonor = properties.amount !== 0;

        if(!wouldGainAnyHonor) {
            return false;
        }

        const [hasHonorLimit, amountToTransfer] = calculateHonorLimit(
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


    override addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
        event.dueToStatusToken = dueToStatusToken;
    }

    override eventHandler(event: ActionEvent<EventName.OnModifyHonor, Context>): void {
        const context = event.context;
        const player = event.player;
        const [, amountToTransfer] = calculateHonorLimit(
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
