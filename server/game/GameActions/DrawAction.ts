import type { Event } from '../Events/Event.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction extends PlayerAction<DrawProperties> {
    name = 'draw';
    eventName = EventNames.OnCardsDrawn;

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

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: Event): void {
        event.player.drawCardsToHand(event.amount);
    }
}
