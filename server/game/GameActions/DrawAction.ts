import type { GameEvent } from '../Events/EventPayloads.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction extends PlayerAction<DrawProperties> {
    name = 'draw';
    eventName = EventName.OnCardsDrawn;

    defaultProperties: DrawProperties = {
        amount: 1
    };

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        let properties = this.getProperties(context);
        return ['draw ' + properties.amount + ((properties.amount ?? 0) > 1 ? ' cards' : ' card'), []];
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: GameEvent<EventName.OnCardsDrawn>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount as number;
    }

    eventHandler(event: GameEvent<EventName.OnCardsDrawn>): void {
        event.player.drawCardsToHand(event.amount);
    }
}
