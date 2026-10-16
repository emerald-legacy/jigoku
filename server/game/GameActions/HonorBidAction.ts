import type { ActionOverrides } from './GameAction.js';
import type { MessageArgs, MsgArg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { EventName, Players } from '../Constants.js';
import { HonorBidPrompt } from '../gamesteps/HonorBidPrompt.js';
import type Player from '../Player.js';
import type { GameAction, ActionEvent } from './GameAction.js';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction.js';
import { queuePostBidSteps } from './FateBidAction.js';
import { SetHonorDialAction } from './SetHonorDialAction.js';

export interface HonorBidProperties<Context extends AbilityContext = AbilityContext> extends PlayerActionProperties {
    giveHonor?: boolean;
    prohibitedBids?: Array<number>;
    players?: Players;
    postBidAction?: GameAction;
    /** The chat line after the bids; without it, the post-bid action's own text. */
    message?(context: Context): MessageArgs;
}

/** An honor bid event this action created: `addPropertiesToEvent` always sets its prohibited bids. */
type HonorBidEvent<Context extends AbilityContext> = ActionEvent<EventName.OnHonorBid, Context> & { prohibitedBids: number[] };

export class HonorBidAction<Context extends AbilityContext = AbilityContext> extends PlayerAction<HonorBidProperties, EventName.OnHonorBid, Context, 'giveHonor' | 'prohibitedBids' | 'players'> {
    override name = 'honorBid';
    override eventName = EventName.OnHonorBid;
    override defaultProperties = {
        giveHonor: false,
        prohibitedBids: [],
        players: Players.Any
    };


    protected override effectMessage(context: Context, additionalProperties: ActionOverrides = {}): MessageArgs {
        return this.getProperties(context, additionalProperties).giveHonor
            ? ['bid honor', []]
            : ['have {0} select a value on their honor dial', []];
    }

    /** The bidding players; none when giving honor, whose message names nobody. */
    protected override effectMessageTarget(context: Context, additionalProperties: ActionOverrides = {}): MsgArg {
        const properties = this.getProperties(context, additionalProperties);
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

    override addPropertiesToEvent(event: ActionEvent<EventName.OnHonorBid, Context>, player: Player, context: Context, additionalProperties: ActionOverrides = {}): void {
        const { giveHonor, prohibitedBids, players, postBidAction, message } = this.getProperties(
            context,
            additionalProperties
        );
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.giveHonor = giveHonor;
        event.prohibitedBids = prohibitedBids;
        event.players = players;
        event.postBidAction = postBidAction;
        event.message = message;
    }

    override eventHandler(event: HonorBidEvent<Context>): void {
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
                    handler: () => new SetHonorDialAction({ value }).resolve(player, context)
                }))
            });
        }
    }
}
