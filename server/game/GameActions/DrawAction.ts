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

export class DrawAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<DrawProperties, EventName.OnCardsDrawn, Context, 'amount'> {
    override name = 'draw';
    override restriction = RestrictionType.Draw;
    override eventName = EventName.OnCardsDrawn;

    override defaultProperties = {
        amount: 1
    };

    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        const { amount } = this.getProperties(context, additionalProperties);
        const cards = amount + (amount > 1 ? ' cards' : ' card');
        return [onlyThePlayer(this.targets(context, additionalProperties), context) ? `draw ${cards}` : `make {0} draw ${cards}`, []];
    }

    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        const players = this.targets(context, additionalProperties);
        return onlyThePlayer(players, context) ? undefined : players;
    }

    private targets(context: Context, additionalProperties: ActionOverrides): Player[] {
        return targetList(this.getProperties(context, additionalProperties).target);
    }

    override canAffect(player: Player, context: Context, additionalProperties: ActionOverrides = {}): boolean {
        const properties = this.getProperties(context, additionalProperties);
        return properties.amount !== 0 && super.canAffect(player, context);
    }


    override addPropertiesToEvent(event: ActionEvent<EventName.OnCardsDrawn, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { amount } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.amount = amount;
    }

    override eventHandler(event: ActionEvent<EventName.OnCardsDrawn, Context>): void {
        event.player.drawCardsToHand(event.amount);
    }
}
