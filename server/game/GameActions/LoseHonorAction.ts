import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface LoseHonorProperties extends PlayerActionProperties {
    amount?: number;
    dueToUnopposed?: boolean;
    dueToStatusToken?: boolean;
}

export class LoseHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<LoseHonorProperties, EventName.OnModifyHonor, C, 'amount' | 'dueToUnopposed' | 'dueToStatusToken'> {
    defaultProperties = { amount: 1, dueToUnopposed: false, dueToStatusToken: false };

    name = 'loseHonor';
    eventName = EventName.OnModifyHonor;

    getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        return ['losing {1} honor', [properties.amount]];
    }

    protected effectMessage(context: C): MessageArgs {
        return ['make {0} lose ' + this.getProperties(context).amount + ' honor', []];
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { amount, dueToUnopposed, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -amount;
        event.dueToUnopposed = dueToUnopposed;
        event.dueToStatusToken = dueToStatusToken;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyHonor, C>): void {
        event.player.modifyHonor(event.amount);
        event.context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: event.amount });
    }
}
