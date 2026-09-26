import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties, type PlayerEvent } from './PlayerAction.js';
import { FateBidPrompt } from '../gamesteps/FateBidPrompt.js';
import { LoseFateAction } from './LoseFateAction.js';
import { JointGameAction } from './JointGameAction.js';

export interface FateBidProperties extends PlayerActionProperties {
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => MsgArg[];
}

export class FateBidAction<C extends AbilityContext = AbilityContext> extends PlayerAction<FateBidProperties, EventName.Unnamed, C> {
    name = 'fateBid';
    eventName = EventName.Unnamed;
    defaultProperties: FateBidProperties = {
        postBidAction: undefined
    };

    constructor(propertyFactory: FateBidProperties | ((context: C) => FateBidProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: C) {
        return [context.player];
    }

    getEffectMessage(context: C): MessageArgs {
        const players = [context.player, context.player.opponent];
        return ['have {0} select an amount of fate from their pool', [players]];
    }

    addPropertiesToEvent(event: PlayerEvent<EventName.Unnamed, C>, player: Player, context: C, additionalProperties: Record<string, unknown>): void {
        let { postBidAction, message, messageArgs } = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.postBidAction = postBidAction;
        event.message = message;
        event.messageArgs = messageArgs;
    }

    eventHandler(event: ActionEvent<EventName.Unnamed, C>): void {
        const context = event.context;
        context.game.queueStep(
            new FateBidPrompt(context.game, 'Choose an amount of fate', (result, context) => {
                const actions: Array<LoseFateAction> = [];
                for(const [player, amount] of result.bids) {
                    context.game.addMessage('{0} spends {1} fate', player, amount);
                    actions.push(new LoseFateAction({ amount, target: player }));
                }
                new JointGameAction(actions).resolve(undefined, context);
            })
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => event.postBidAction && event.postBidAction.resolve(context.player, context))
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => {
                const [message, messageArgs]: MessageArgs = event.message
                    ? [event.message, event.messageArgs ? Array.from(event.messageArgs(context)) : []]
                    : (event.postBidAction ? event.postBidAction.getEffectMessage(context) : ['', []]);
                context.game.addMessage(message, ...messageArgs);
            })
        );
    }
}
