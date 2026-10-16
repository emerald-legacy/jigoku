import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface LoseHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToUnopposed?: boolean;
    dueToStatusToken?: boolean;
}

export class LoseHonorAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<LoseHonorProperties, EventName.OnModifyHonor, Context, 'amount' | 'dueToUnopposed' | 'dueToStatusToken'> {
    override defaultProperties = { amount: 1, dueToUnopposed: false, dueToStatusToken: false };

    override name = 'loseHonor';

    override restriction = RestrictionType.LoseHonor;
    override eventName = EventName.OnModifyHonor;

    override getCostMessage(context: Context): MessageArgs {
        const properties = this.getProperties(context);
        return ['losing {1} honor', [properties.amount]];
    }

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['make {0} lose ' + this.getProperties(context, additionalProperties).amount + ' honor', []];
    }


    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount, dueToUnopposed, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -amount;
        event.dueToUnopposed = dueToUnopposed;
        event.dueToStatusToken = dueToStatusToken;
    }

    override eventHandler(event: ActionEvent<EventName.OnModifyHonor, Context>): void {
        event.player.modifyHonor(event.amount);
        event.context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: event.amount });
    }
}
