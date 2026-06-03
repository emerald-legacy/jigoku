import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type { GameAction } from './GameAction.js';
import type Player from '../Player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { FateBidPrompt } from '../gamesteps/FateBidPrompt.js';
import { LoseFateAction } from './LoseFateAction.js';
import { JointGameAction } from './JointGameAction.js';

import type { GameEvent } from '../Events/EventPayloads.js';
export interface FateBidProperties extends PlayerActionProperties {
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => unknown[];
}

export class FateBidAction extends PlayerAction<FateBidProperties, EventNames.Unnamed> {
    name = 'fateBid';
    eventName = EventNames.Unnamed;
    defaultProperties: FateBidProperties = {
        postBidAction: undefined
    };

    constructor(propertyFactory: FateBidProperties | ((context: AbilityContext) => FateBidProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext) {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, unknown[]] {
        const players = [context.player, context.player.opponent];
        return ['have {0} select an amount of fate from their pool', [players]];
    }

    addPropertiesToEvent(event: GameEvent<EventNames.Unnamed>, player: Player, context: AbilityContext, additionalProperties: Record<string, unknown>): void {
        let { postBidAction, message, messageArgs } = this.getProperties(
            context,
            additionalProperties
        ) as FateBidProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        const bidEvent = event as GameEvent<EventNames.OnHonorBid>;
        bidEvent.postBidAction = postBidAction;
        bidEvent.message = message;
        bidEvent.messageArgs = messageArgs;
    }

    eventHandler(event: GameEvent<EventNames.Unnamed>): void {
        const bidEvent = event as GameEvent<EventNames.OnHonorBid>;
        const context = (event.context as AbilityContext);
        context.game.queueStep(
            new FateBidPrompt(context.game, 'Choose an amount of fate', (result, context) => {
                const actions: Array<LoseFateAction> = [];
                for(const [player, amount] of result.bids) {
                    context.game.addMessage('{0} spends {1} fate', player, amount);
                    actions.push(new LoseFateAction({ amount, target: player }));
                }
                new JointGameAction(actions).resolve(undefined, context);
                // @ts-expect-error -- fateBidResult is dynamically added to context for downstream ability resolution
                context.fateBidResult = result;
            })
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => bidEvent.postBidAction && bidEvent.postBidAction.resolve(context.player, context))
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => {
                const [message, messageArgs] = bidEvent.message
                    ? [bidEvent.message, bidEvent.messageArgs ? Array.from(bidEvent.messageArgs(context)) : []]
                    : (bidEvent.postBidAction ? bidEvent.postBidAction.getEffectMessage(context) : ['', []]);
                context.game.addMessage(message, ...messageArgs);
            })
        );
    }
}
