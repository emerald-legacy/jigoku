import type Player from './Player.js';
import MenuPrompt from './gamesteps/MenuPrompt.js';
import HandlerMenuPrompt from './gamesteps/HandlerMenuPrompt.js';
import HonorBidPrompt from './gamesteps/HonorBidPrompt.js';
import SelectCardPrompt from './gamesteps/SelectCardPrompt.js';
import SelectRingPrompt from './gamesteps/SelectRingPrompt.js';

export class GamePromptHelper {
    constructor(private game: any) {}

    promptWithMenu(player: Player, contextObj: any, properties: any): void {
        this.game.queueStep(new MenuPrompt(this.game, player, contextObj, properties));
    }

    promptWithHandlerMenu(player: Player, properties: any): void {
        this.game.queueStep(new HandlerMenuPrompt(this.game, player, properties));
    }

    promptForSelect(player: Player, properties: any): void {
        this.game.queueStep(new SelectCardPrompt(this.game, player, properties));
    }

    promptForRingSelect(player: Player, properties: any): void {
        this.game.queueStep(new SelectRingPrompt(this.game, player, properties));
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: any, prohibitedBids?: any, duel: any = null): void {
        this.game.queueStep(new HonorBidPrompt(this.game, activePromptTitle, costHandler, prohibitedBids, duel));
    }
}
