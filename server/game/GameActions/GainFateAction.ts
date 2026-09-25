import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface GainFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainFateAction<C extends AbilityContext = AbilityContext> extends PlayerAction<GainFateProperties, EventName, C> {
    defaultProperties: GainFateProperties = { amount: 1 };

    name = 'gainFate';
    eventName = EventName.OnModifyFate;

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['gain {0} fate', [properties.amount]];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnModifyFate, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: ActionEvent<EventName.OnModifyFate, C>): void {
        (event.player as Player).modifyFate(event.amount as number);
    }
}
