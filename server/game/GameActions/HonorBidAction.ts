import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Players } from '../Constants.js';
import HonorBidPrompt from '../gamesteps/HonorBidPrompt.js';
import type Player from '../Player.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { queuePostBidSteps } from './FateBidAction.js';

export interface HonorBidProperties extends PlayerActionProperties {
    giveHonor?: boolean;
    prohibitedBids?: Array<number>;
    players?: Players;
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => MsgArg[];
}

/** An honor bid event this action created: `addPropertiesToEvent` always sets its prohibited bids. */
type HonorBidEvent<C extends AbilityContext> = ActionEvent<EventName.OnHonorBid, C> & { prohibitedBids: number[] };

export class HonorBidAction<C extends AbilityContext = AbilityContext> extends PlayerAction<HonorBidProperties, EventName.OnHonorBid, C, 'giveHonor' | 'prohibitedBids' | 'players'> {
    name = 'honorBid';
    eventName = EventName.OnHonorBid;
    defaultProperties = {
        giveHonor: false,
        prohibitedBids: [],
        players: Players.Any
    };

    defaultTargets(context: C) {
        return [context.player];
    }

    protected effectMessage(context: C): MessageArgs {
        return this.getProperties(context).giveHonor
            ? ['bid honor', []]
            : ['have {0} select a value on their honor dial', []];
    }

    /** The bidding players; none when giving honor, whose message names nobody. */
    protected effectMessageTarget(context: C): MsgArg {
        const properties = this.getProperties(context);
        if(properties.giveHonor) {
            return undefined;
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
        return players;
    }

    addPropertiesToEvent(event: ActionEvent<EventName.OnHonorBid, C>, player: Player, context: C, additionalProperties: Record<string, unknown> = {}): void {
        const { giveHonor, prohibitedBids, players, postBidAction, message, messageArgs } = this.getProperties(
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

    eventHandler(event: HonorBidEvent<C>): void {
        const context = event.context;

        if(event.players === Players.Any) {
            const prohibitedBids: Record<string, string[]> = {};
            for(const player of context.game.getPlayers()) {
                prohibitedBids[player.uuid] = event.prohibitedBids.map((bid) => String(bid));
            }
            const costHandler = event.giveHonor ? undefined : () => {};
            context.game.queueStep(
                new HonorBidPrompt(context.game, 'Choose your bid', costHandler, prohibitedBids, null, true)
            );
            queuePostBidSteps(event, context);
        } else {
            const player = event.players === Players.Self ? context.player : context.player.opponent;
            if(!player) {
                return;
            }

            context.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Choose a value to set your honor dial at',
                context: context,
                options: [1, 2, 3, 4, 5].map((value) => ({
                    text: value.toString(),
                    handler: () => context.game.actions.setHonorDial({ value }).resolve(player, context)
                }))
            });
        }
    }
}
