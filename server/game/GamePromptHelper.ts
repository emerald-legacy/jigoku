import type Player from './Player.js';
import type Game from './Game.js';
import { MenuPrompt, type MenuHandlers, type MenuPromptProperties } from './gamesteps/MenuPrompt.js';
import { HandlerMenuPrompt, type HandlerMenuPromptProperties } from './gamesteps/HandlerMenuPrompt.js';
import { HonorBidPrompt } from './gamesteps/HonorBidPrompt.js';
import { SelectCardPrompt, type SelectCardPromptProperties } from './gamesteps/SelectCardPrompt.js';
import { SelectRingPrompt } from './gamesteps/SelectRingPrompt.js';
import type { CardTypes } from './types/CardOfType.js';
import type BaseCard from './BaseCard.js';

export class GamePromptHelper {
    constructor(private game: Game) {}

    promptWithMenu(player: Player, handlers: MenuHandlers, properties: MenuPromptProperties): void {
        this.game.queueStep(new MenuPrompt(this.game, player, handlers, properties));
    }

    /** "Name a card": the player types a card name, and `onName` gets it. */
    promptForCardName(player: Player, onName: (player: Player, cardName: string) => void, menuTitle = 'Name a card'): void {
        this.promptWithMenu(player, {
            selectCardName: (namingPlayer, cardName) => {
                onName(namingPlayer, cardName);
                return true;
            }
        }, {
            activePrompt: {
                menuTitle,
                controls: [{ type: 'card-name', command: 'menuButton', method: 'selectCardName', name: 'card-name' }]
            }
        });
    }

    promptWithHandlerMenu<T extends BaseCard, C extends string | number | undefined>(player: Player, properties: HandlerMenuPromptProperties<T, C>): void {
        this.game.queueStep(new HandlerMenuPrompt(this.game, player, properties));
    }

    promptForSelect<K extends CardTypes>(player: Player, properties: SelectCardPromptProperties<K>): void {
        this.game.queueStep(new SelectCardPrompt(this.game, player, properties));
    }

    promptForRingSelect(player: Player, properties: ConstructorParameters<typeof SelectRingPrompt>[2]): void {
        this.game.queueStep(new SelectRingPrompt(this.game, player, properties));
    }

    promptForHonorBid(activePromptTitle: string, costHandler?: ConstructorParameters<typeof HonorBidPrompt>[2], prohibitedBids?: ConstructorParameters<typeof HonorBidPrompt>[3], duel: ConstructorParameters<typeof HonorBidPrompt>[4] = null): void {
        this.game.queueStep(new HonorBidPrompt(this.game, activePromptTitle, costHandler, prohibitedBids, duel));
    }
}
