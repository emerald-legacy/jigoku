import { CalculateHonorLimit } from '../GameActions/Shared/HonorLogic.js';
import { AllPlayerPrompt } from './AllPlayerPrompt.js';
import { TakeHonorAction } from '../GameActions/TakeHonorAction.js';
import { EventName, EffectName } from '../Constants.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type { Duel } from '../Duel.js';

type HonorBidCostHandler = (prompt: HonorBidPrompt) => void;

export class HonorBidPrompt extends AllPlayerPrompt {
    menuTitle: string;
    costHandler?: HonorBidCostHandler;
    prohibitedBids: Record<string, string[]>;
    duel: Duel | null;
    bid: Record<string, number>;
    raiseEvent: boolean;

    constructor(game: Game, menuTitle: string, costHandler?: HonorBidCostHandler, prohibitedBids: Record<string, string[]> = {}, duel: Duel | null = null, raiseEvent = true) {
        super(game);
        this.menuTitle = menuTitle || 'Choose a bid';
        this.costHandler = costHandler;
        this.prohibitedBids = prohibitedBids;
        this.duel = duel;
        this.bid = {};
        this.raiseEvent = raiseEvent;
    }

    activeCondition(player: Player): boolean {
        return !this.bid[player.uuid];
    }

    completionCondition(player: Player): boolean {
        return this.bid[player.uuid] > 0;
    }

    continue(): boolean {
        const completed = super.continue();

        if(completed) {
            const isHonorBid = typeof this.costHandler !== 'function';
            const revealDials = () => {
                for(const player of this.game.getPlayers()) {
                    player.honorBidModifier = 0;
                    this.game.actions
                        .setHonorDial({ value: this.bid[player.uuid] })
                        .resolve(player, this.game.getFrameworkContext(player));
                }
            };
            if(this.raiseEvent) {
                this.game.raiseEvent(EventName.OnHonorDialsRevealed, { duel: this.duel, isHonorBid }, revealDials);
            } else {
                this.game.raiseEvent(EventName.Unnamed, { duel: this.duel, isHonorBid }, revealDials);
            }
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
        let amount = Math.abs(difference);
        const givingPlayer: Player = difference > 0 ? firstPlayer : firstPlayer.opponent;
        const receivingPlayer = givingPlayer.opponent;
        if(!receivingPlayer) {
            return;
        }

        const modifyGivenAmount = givingPlayer.sumEffects(EffectName.ModifyHonorTransferGiven);
        const modifyReceivedAmount = receivingPlayer.sumEffects(EffectName.ModifyHonorTransferReceived);
        amount = amount + modifyGivenAmount + modifyReceivedAmount;

        var [, amountToTransfer] = CalculateHonorLimit(receivingPlayer, context.game.roundNumber, context.game.currentPhase, amount);
        this.game.addMessage('{0} gives {1} {2} honor', givingPlayer, receivingPlayer, amountToTransfer);
        const gameAction = new TakeHonorAction({ amount: Math.abs(difference), afterBid: true });
        gameAction.resolve(givingPlayer, context);
    }

    activePrompt(player: Player) {
        let buttons = [...this.game.rules.honorBidValues];

        const prohibitedBids = this.prohibitedBids[player.uuid] || [];
        buttons = buttons.filter((num) => !prohibitedBids.includes(num));
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: buttons.map((num) => ({ text: num, arg: num }))
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose a bid.' };
    }

    menuCommand(player: Player, bid: string): boolean {
        this.game.addMessage('{0} has chosen a bid.', player);

        this.bid[player.uuid] = parseInt(bid);

        return true;
    }
}

