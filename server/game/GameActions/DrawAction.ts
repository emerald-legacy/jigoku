import type { MessageArgs } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction<C extends AbilityContext = AbilityContext> extends PlayerAction<DrawProperties, EventName.OnCardsDrawn, C> {
    name = 'draw';
    eventName = EventName.OnCardsDrawn;

    defaultProperties: DrawProperties = {
        amount: 1
    };

    getEffectMessage(context: C): MessageArgs {
        let properties = this.getProperties(context);
        return ['draw ' + properties.amount + ((properties.amount ?? 0) > 1 ? ' cards' : ' card'), []];
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDrawn, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount ?? 0;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDrawn, C>): void {
        event.player.drawCardsToHand(event.amount);
    }
}
