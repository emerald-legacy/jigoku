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

export class LoseHonorAction<C extends AbilityContext = AbilityContext> extends PlayerAction<LoseHonorProperties, EventName, C> {
    defaultProperties: LoseHonorProperties = { amount: 1, dueToUnopposed: false, dueToStatusToken: false };

    name = 'loseHonor';
    eventName = EventName.OnModifyHonor;

    getCostMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['losing {1} honor', [properties.amount]];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['make {0} lose ' + properties.amount + ' honor', [properties.target]];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.amount === 0 ? false : super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyHonor, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount, dueToUnopposed, dueToStatusToken } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -(amount ?? 0);
        event.dueToUnopposed = dueToUnopposed;
        event.dueToStatusToken = dueToStatusToken;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyHonor, C>): void {
        if(event.player) {
            event.player.modifyHonor(event.amount as number);
            if(event.context?.game) {
                event.context.game.addAnimation({ type: 'honor', playerName: event.player.name, amount: event.amount as number });
            }
        }
    }
}
