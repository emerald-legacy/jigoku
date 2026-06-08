import type { MessageArgs } from '../GameChat.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface GainFateProperties extends PlayerActionProperties {
    amount?: number;
}

export class GainFateAction extends PlayerAction<GainFateProperties> {
    defaultProperties: GainFateProperties = { amount: 1 };

    name = 'gainFate';
    eventName = EventName.OnModifyFate;

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): MessageArgs {
        let properties = this.getProperties(context);
        return ['gain {0} fate', [properties.amount]];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return (properties.amount ?? 0) > 0 && super.canAffect(player, context);
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnModifyFate>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: GameEvent<EventName.OnModifyFate>): void {
        (event.player as Player).modifyFate(event.amount as number);
    }
}
