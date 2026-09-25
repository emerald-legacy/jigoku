import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Players } from '../Constants.js';
import HonorBidPrompt from '../gamesteps/HonorBidPrompt.js';
import { SimpleStep } from '../gamesteps/SimpleStep.js';
import type Player from '../Player.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';

export interface HonorBidProperties extends PlayerActionProperties {
    giveHonor?: boolean;
    prohibitedBids?: Array<number>;
    players?: Players;
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => MsgArg[];
}

export class HonorBidAction<C extends AbilityContext = AbilityContext> extends PlayerAction<HonorBidProperties, EventName.OnHonorBid, C> {
    name = 'honorBid';
    eventName = EventName.OnHonorBid;
    defaultProperties: HonorBidProperties = {
        giveHonor: false,
        prohibitedBids: [],
        players: Players.Any,
        postBidAction: undefined
    };

    constructor(propertyFactory: HonorBidProperties | ((context: C) => HonorBidProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: C) {
        return [context.player];
    }

    getEffectMessage(context: C): MessageArgs {
        let properties: HonorBidProperties = this.getProperties(context);
        if(properties.giveHonor) {
            return ['bid honor', []];
        }

        const players = [];
        switch(properties.players) {
            case Players.Any:
                players.push(context.player);
                players.push(context.player.opponent);
                break;
            case Players.Self:
                players.push(context.player);
                break;
            case Players.Opponent:
                players.push(context.player.opponent);
                break;
        }
        return ['have {0} select a value on their honor dial', [players]];
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnHonorBid, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        let { giveHonor, prohibitedBids, players, postBidAction, message, messageArgs } = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.giveHonor = giveHonor;
        event.prohibitedBids = prohibitedBids;
        event.players = players;
        event.postBidAction = postBidAction;
        event.message = message;
        event.messageArgs = messageArgs;
    }

    eventHandler(event: ActionEvent<EventName.OnHonorBid, C>): void {
        const context = event.context;

        if(event.players === Players.Any) {
            const prohibitedBids: Record<string, string[]> = {};
            for(const player of context.game.getPlayers()) {
                prohibitedBids[player.uuid] = (event.prohibitedBids ?? []).map((bid) => String(bid));
            }
            const costHandler = event.giveHonor ? undefined : () => {};
            context.game.queueStep(
                new HonorBidPrompt(context.game, 'Choose your bid', costHandler, prohibitedBids, null, true)
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
        } else {
            const player = (event.players === Players.Self ? context.player : context.player.opponent) as Player;

            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Choose a value to set your honor dial at',
                context: context,
                choices: ['1', '2', '3', '4', '5'],
                handlers: [1, 2, 3, 4, 5].map(
                    (value) => () => context.game.actions.setHonorDial({ value }).resolve(player, context)
                )
            });
        }
    }
}
