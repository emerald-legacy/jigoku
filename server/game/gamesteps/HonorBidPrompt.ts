import { msg } from '../GameChat.js';
import { AllPlayerPrompt } from './AllPlayerPrompt.js';
import { EventName } from '../Constants.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type { Duel } from '../Duel.js';
import { setHonorDial, takeHonor } from '../GameActions/GameActions.js';

type HonorBidCostHandler = (prompt: HonorBidPrompt) => void;

export class HonorBidPrompt extends AllPlayerPrompt {
    menuTitle: string;
    costHandler?: HonorBidCostHandler;
    prohibitedBids: Record<string, string[]>;
    duel: Duel | null;
    bid: Record<string, number>;

    constructor(game: Game, menuTitle: string, costHandler?: HonorBidCostHandler, prohibitedBids: Record<string, string[]> = {}, duel: Duel | null = null) {
        super(game);
        this.menuTitle = menuTitle || 'Choose a bid';
        this.costHandler = costHandler;
        this.prohibitedBids = prohibitedBids;
        this.duel = duel;
        this.bid = {};
    }

    override activeCondition(player: Player): boolean {
        return !this.bid[player.uuid];
    }

    override completionCondition(player: Player): boolean {
        return this.bid[player.uuid] > 0;
    }

    override continue(): boolean {
        const completed = super.continue();

        if(completed) {
            // every duel transfers honor (or a substitute); only reveals like Mischievous Tanuki's don't
            const isHonorBid = !!this.duel || typeof this.costHandler !== 'function';
            const revealDials = () => {
                for(const player of this.game.getPlayersInFirstPlayerOrder()) {
                    player.honorBidModifier = 0;
                    setHonorDial({ value: this.bid[player.uuid] })
                        .resolve(player, this.game.getFrameworkContext(player));
                }
            };
            this.game.raiseEvent(EventName.OnHonorDialsRevealed, { duel: this.duel, isHonorBid }, revealDials);
            if(this.duel) {
                this.game.raiseEvent(EventName.OnDuelFocus, { duel: this.duel, isHonorBid });
            }
            if(this.costHandler) {
                const costHandler = this.costHandler;
                this.game.queueSimpleStep(() => costHandler(this));
            } else {
                this.game.queueSimpleStep(() => this.transferHonorAfterBid());
            }
        }

        return completed;
    }

    transferHonorAfterBid(context = this.game.getGameContext()) {
        const firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer || !firstPlayer.opponent) {
            return;
        }
        const difference = firstPlayer.honorBid - firstPlayer.opponent.honorBid;
        if(difference === 0) {
            return;
        }
        const givingPlayer: Player = difference > 0 ? firstPlayer : firstPlayer.opponent;
        takeHonor({ amount: Math.abs(difference), afterBid: true }).resolve(givingPlayer, context);
    }

    override activePrompt(player: Player) {
        let buttons = [...this.game.rules.honorBidValues];

        const prohibitedBids = this.prohibitedBids[player.uuid] || [];
        buttons = buttons.filter((num) => !prohibitedBids.includes(num));
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: buttons.map((num) => ({ text: num, arg: num }))
        };
    }

    override waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose a bid.' };
    }

    override menuCommand(player: Player, bid: string): boolean {
        this.game.addMessage(msg`${player} has chosen a bid.`);

        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

