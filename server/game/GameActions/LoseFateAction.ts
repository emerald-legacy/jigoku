import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<LoseFateProperties, EventName.OnModifyFate, C, 'amount'> {
    name = 'spendFate';
    eventName = EventName.OnModifyFate;
    defaultProperties = { amount: 1 };

    protected effectMessage(context: C): MessageArgs {
        return ['make {0} lose {1} fate', [this.getProperties(context).amount]];
    }

    getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        return ['spending {1} fate', [properties.amount]];
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.fate > 0 && super.canAffect(player, context, additionalProperties);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyFate, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -amount;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyFate, C>): void {
        event.player.modifyFate(event.amount);
    }
}
