import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface GainFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<GainFateProperties, EventName.OnModifyFate, C, 'amount'> {
    defaultProperties = { amount: 1 };

    name = 'gainFate';

    restriction = RestrictionType.GainFate;
    eventName = EventName.OnModifyFate;

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    protected effectMessage(): MessageArgs {
        return ['gain {0} fate', []];
    }

    protected effectMessageTarget(context: C): MsgArg {
        return this.getProperties(context).amount;
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyFate, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyFate, C>): void {
        event.player.modifyFate(event.amount);
    }
}
