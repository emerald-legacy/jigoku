import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import { HonorBidPrompt } from '../gamesteps/HonorBidPrompt.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface HonorBidProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    giveHonor?: boolean;
    postBidAction?: GameAction;
    /** The chat line after the bids; without it, the post-bid action's own text. */
    message?(context: Context): MessageArgs;
}

export class HonorBidAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<HonorBidProperties, EventName.OnHonorBid, Context, 'giveHonor'> {
    override name = 'honorBid';
    override eventName = EventName.OnHonorBid;
    override defaultProperties = {
        giveHonor: false
    };


    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return this.getProperties(context, additionalProperties).giveHonor
            ? ['bid honor', []]
            : ['have {0} select a value on their honor dial', []];
    }

    /** Both players; none when giving honor, whose message names nobody. */
    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        return this.getProperties(context, additionalProperties).giveHonor ? undefined : [context.player, context.player.opponent];
    }

    override addPropertiesToEvent(event: ActionEvent<EventName.OnHonorBid, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { giveHonor, postBidAction, message } = this.getProperties(context, additionalProperties);
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.giveHonor = giveHonor;
        event.postBidAction = postBidAction;
        event.message = message;
    }

    override eventHandler(event: ActionEvent<EventName.OnHonorBid, Context>): void {
        const context = event.context;
        const costHandler = event.giveHonor ? undefined : () => {};
        context.game.queueStep(new HonorBidPrompt(context.game, 'Choose your bid', costHandler));
        context.game.queueStep(
            new SimpleStep(context.game, () => event.postBidAction && event.postBidAction.resolve(context.player, context))
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => {
                context.game.addMessage(event.message
                    ? event.message(context)
                    : (event.postBidAction ? event.postBidAction.getEffectMessage(context) : ['', []]));
            })
        );
    }
}
