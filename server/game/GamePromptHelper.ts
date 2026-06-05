import type Player from './Player.js';
import type Game from './Game.js';
import MenuPrompt from './gamesteps/MenuPrompt.js';
import HandlerMenuPrompt from './gamesteps/HandlerMenuPrompt.js';
import HonorBidPrompt from './gamesteps/HonorBidPrompt.js';
import SelectCardPrompt from './gamesteps/SelectCardPrompt.js';
import SelectRingPrompt from './gamesteps/SelectRingPrompt.js';

export class GamePromptHelper {
    constructor(private game: Game) {}

    promptWithMenu(player: Player, contextObj: ConstructorParameters<typeof MenuPrompt>[2], properties: ConstructorParameters<typeof MenuPrompt>[3]): void {
        this.game.queueStep(new MenuPrompt(this.game, player, contextObj, properties));
    }

    promptWithHandlerMenu(player: Player, properties: ConstructorParameters<typeof HandlerMenuPrompt>[2]): void {
        this.game.queueStep(new HandlerMenuPrompt(this.game, player, properties));
    }

    promptForSelect(player: Player, properties: ConstructorParameters<typeof SelectCardPrompt>[2]): void {
        this.game.queueStep(new SelectCardPrompt(this.game, player, properties));
    }

    promptForRingSelect(player: Player, properties: ConstructorParameters<typeof SelectRingPrompt>[2]): void {
        this.game.queueStep(new SelectRingPrompt(this.game, player, properties));
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: ConstructorParameters<typeof HonorBidPrompt>[2], prohibitedBids?: ConstructorParameters<typeof HonorBidPrompt>[3], duel: ConstructorParameters<typeof HonorBidPrompt>[4] = null): void {
        this.game.queueStep(new HonorBidPrompt(this.game, activePromptTitle, costHandler, prohibitedBids, duel));
    }
}
