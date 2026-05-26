import type { AbilityContext } from '../AbilityContext.js';
import { EventNames } from '../Constants.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type { GameAction } from './GameAction.js';
import type Player from '../player.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { FateBidPrompt } from '../gamesteps/FateBidPrompt.js';
import { LoseFateAction } from './LoseFateAction.js';
import { JointGameAction } from './JointGameAction.js';

import type { Event } from '../Events/Event.js';
export interface FateBidProperties extends PlayerActionProperties {
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => any | any[];
}

export class FateBidAction extends PlayerAction {
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

    getEffectMessage(context: AbilityContext): [string, any[]] {
        const players = [context.player, context.player.opponent];
        return ['have {0} select an amount of fate from their pool', [players]];
    }

    addPropertiesToEvent(event: Event, player: Player, context: AbilityContext, additionalProperties: any): void {
        let { postBidAction, message, messageArgs } = this.getProperties(
            context,
            additionalProperties
        ) as FateBidProperties;
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.postBidAction = postBidAction;
        event.message = message;
        event.messageArgs = messageArgs;
    }

    eventHandler(
        event: { context: AbilityContext } & Pick<FateBidProperties, 'postBidAction' | 'messageArgs' | 'message'>
    ): void {
        const context = event.context!;
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
            new SimpleStep(context.game, () => event.postBidAction && event.postBidAction.resolve(context.player, context))
        );
        context.game.queueStep(
            new SimpleStep(context.game, () => {
                const [message, messageArgs] = event.message
                    ? [event.message, event.messageArgs ? Array.from(event.messageArgs(context)) : []]
                    : (event.postBidAction ? event.postBidAction.getEffectMessage(context) : ['', []]);
                context.game.addMessage(message, ...messageArgs);
            })
        );
    }
}
