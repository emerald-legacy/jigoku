import { CalculateHonorLimit } from '../GameActions/Shared/HonorLogic.js';
import { AllPlayerPrompt } from './AllPlayerPrompt.js';
import { TransferHonorAction } from '../GameActions/TransferHonorAction.js';
import { EventNames, EffectNames } from '../Constants.js';
import { GameModes } from '../../GameModes.js';
import type Player from '../Player.js';
import type Game from '../Game.js';
import type { Duel } from '../Duel.js';

type HonorBidCostHandler = (prompt: HonorBidPrompt) => void;

class HonorBidPrompt extends AllPlayerPrompt {
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
        let completed = super.continue();

        if(completed) {
            const eventName = this.raiseEvent ? EventNames.OnHonorDialsRevealed : EventNames.Unnamed;
            const eventProps = { duel: this.duel, isHonorBid: typeof this.costHandler !== 'function' };
            this.game.raiseEvent(eventName, eventProps, () => {
                for(const player of this.game.getPlayers()) {
                    player.honorBidModifier = 0;
                    this.game.actions
                        .setHonorDial({ value: this.bid[player.uuid] })
                        .resolve(player, this.game.getFrameworkContext());
                }
            });
            if(this.duel) {
                this.game.raiseEvent(EventNames.OnDuelFocus, eventProps);
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

    transferHonorAfterBid(context = this.game.getFrameworkContext()) {
        let firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer || !firstPlayer.opponent) {
            return;
        }
        let difference = firstPlayer.honorBid - firstPlayer.opponent.honorBid;
        if(difference === 0) {
            return;
        }
        let amount = Math.abs(difference);
        let givingPlayer: Player = difference > 0 ? firstPlayer : firstPlayer.opponent;
        let receivingPlayer = givingPlayer.opponent;
        if(!receivingPlayer) {
            return;
        }

        const modifyGivenAmount = givingPlayer.getEffects(EffectNames.ModifyHonorTransferGiven).reduce((a: number, b: number) => a + b, 0);
        const modifyReceivedAmount = receivingPlayer.getEffects(EffectNames.ModifyHonorTransferReceived).reduce((a: number, b: number) => a + b, 0);
        amount = amount + modifyGivenAmount + modifyReceivedAmount;

        var [, amountToTransfer] = CalculateHonorLimit(receivingPlayer, context.game.roundNumber, context.game.currentPhase, amount);
        this.game.addMessage('{0} gives {1} {2} honor', givingPlayer, receivingPlayer, amountToTransfer);
        const gameAction = new TransferHonorAction({ amount: Math.abs(difference), afterBid: true });
        gameAction.resolve(givingPlayer, context);
    }

    activePrompt(player: Player) {
        let buttons = ['1', '2', '3', '4', '5'];
        if(this.game.gameMode === GameModes.Skirmish) {
            buttons = ['1', '2', '3'];
        }

        let prohibitedBids = this.prohibitedBids[player.uuid] || [];
        buttons = buttons.filter(num => !prohibitedBids.includes(num));
        return {
            promptTitle: 'Honor Bid',
            menuTitle: this.menuTitle,
            buttons: buttons.map(num => ({ text: num, arg: num }))
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

export default HonorBidPrompt;
