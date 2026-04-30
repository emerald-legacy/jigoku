import type Player from './player';
import MenuPrompt from './gamesteps/menuprompt.js';
import HandlerMenuPrompt from './gamesteps/handlermenuprompt.js';
import HonorBidPrompt from './gamesteps/honorbidprompt.js';
import SelectCardPrompt from './gamesteps/selectcardprompt.js';
import SelectRingPrompt from './gamesteps/selectringprompt.js';

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
