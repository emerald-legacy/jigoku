import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface LoseFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class LoseFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<LoseFateProperties, EventName.OnModifyFate, C, 'amount'> {
    override name = 'loseFate';
    override restriction = RestrictionType.SpendFate;
    override eventName = EventName.OnModifyFate;
    override defaultProperties = { amount: 1 };

    protected override effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        return ['make {0} lose {1} fate', [this.getProperties(context, additionalProperties).amount]];
    }

    override getCostMessage(context: C): MessageArgs {
        const properties = this.getProperties(context);
        return ['spending {1} fate', [properties.amount]];
    }


    override canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && player.fate > 0 && super.canAffect(player, context, additionalProperties);
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnModifyFate, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = -amount;
    }

    override eventHandler(event: ActionEvent<EventName.OnModifyFate, C>): void {
        event.player.modifyFate(event.amount);
    }
}
