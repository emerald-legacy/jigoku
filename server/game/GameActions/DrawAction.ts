import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, RestrictionType } from '../Constants.js';
import type Player from '../Player.js';
import { onlyThePlayer, PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { type ActionEvent, targetList } from './GameAction.js';

export interface DrawProperties extends PlayerActionProperties {
    amount?: number;
}

export class DrawAction<C extends AbilityContext = AbilityContext> extends PlayerAction<DrawProperties, EventName.OnCardsDrawn, C, 'amount'> {
    name = 'draw';
    restriction = RestrictionType.Draw;
    eventName = EventName.OnCardsDrawn;

    defaultProperties = {
        amount: 1
    };

    protected effectMessage(context: C, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { amount } = this.getProperties(context, additionalProperties);
        const cards = amount + (amount > 1 ? ' cards' : ' card');
        return [onlyThePlayer(this.targets(context, additionalProperties), context) ? `draw ${cards}` : `make {0} draw ${cards}`, []];
    }

    protected effectMessageTarget(context: C, additionalProperties: ActionOverrides = {}): MsgArg {
        const players = this.targets(context, additionalProperties);
        return onlyThePlayer(players, context) ? undefined : players;
    }

    private targets(context: C, additionalProperties: ActionOverrides): Player[] {
        return targetList(this.getProperties(context, additionalProperties).target);
    }

    canAffect(player: Player, context: C, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }


    addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDrawn, C>, player: Player, context: C, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    eventHandler(event: ActionEvent<EventName.OnCardsDrawn, C>): void {
        event.player.drawCardsToHand(event.amount);
    }
}
