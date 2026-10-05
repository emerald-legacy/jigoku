import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import type { ActionEvent } from './GameAction.js';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction<C extends AbilityContext = AbilityContext> extends PlayerAction<DrawProperties, EventName.OnCardsDrawn, C, 'amount'> {
    name = 'draw';
    eventName = EventName.OnCardsDrawn;

    defaultProperties = {
        amount: 1
    };

    protected effectMessage(context: C): MessageArgs {
        const { amount } = this.getProperties(context);
        return ['draw ' + amount + (amount > 1 ? ' cards' : ' card'), []];
    }

    protected effectMessageTarget(): MsgArg {
        return undefined;
    }

    canAffect(player: Player, context: C, additionalProperties = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context: C): Player[] {
        return [context.player];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDrawn, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDrawn, C>): void {
        event.player.drawCardsToHand(event.amount);
    }
}
