import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';
import { FateBidPrompt } from '../gamesteps/FateBidPrompt.js';
import { LoseFateAction } from './LoseFateAction.js';
import { JointGameAction } from './JointGameAction.js';

export interface FateBidProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    postBidAction?: GameAction;
    /** The chat line after the bids; without it, the post-bid action's own text. */
    message?(context: Context): MessageArgs;
}

type PostBid = Pick<FateBidProperties, 'postBidAction' | 'message'>;

export function queuePostBidSteps(event: PostBid, context: AbilityContext): void {
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

export class FateBidAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<FateBidProperties, EventName.Unnamed, Context> {
    override name = 'fateBid';
    override eventName = EventName.Unnamed;


    protected override effectMessage(): MessageArgs {
        return ['have {0} select an amount of fate from their pool', []];
    }

    protected override effectMessageTarget(context: Context): MsgArg {
        return [context.player, context.player.opponent];
    }

    override addPropertiesToEvent(event: PlayerEvent<EventName.Unnamed, Context>, player: Player, context: Context, additionalProperties: Record<string, unknown>): void {
        const { postBidAction, message } = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.postBidAction = postBidAction;
        event.message = message;
    }

    override eventHandler(event: ActionEvent<EventName.Unnamed, Context>): void {
        const context = event.context;
        context.game.queueStep(
            new FateBidPrompt(context.game, 'Choose an amount of fate', (result, context) => {
                const actions: Array<LoseFateAction> = [];
                for(const [player, amount] of result.bids) {
                    context.game.addMessage(msg`${player} spends ${amount} fate`);
                    actions.push(new LoseFateAction({ amount, target: player }));
                }
                new JointGameAction(actions).resolve(undefined, context);
            })
        );
        queuePostBidSteps(event, context);
    }
}
