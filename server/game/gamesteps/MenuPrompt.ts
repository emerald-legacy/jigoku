import { UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';

type MenuCommandHandler = (player: Player, arg: string, context?: unknown) => boolean;

type MenuContext = object;

type MenuPromptButton = { text?: string; arg?: string; method?: string; [key: string]: unknown };

interface MenuPromptProperties {
    source?: { name: string } | string;
    waitingPromptTitle?: string;
    promptTitle?: string;
    activePrompt: { buttons?: MenuPromptButton[]; [key: string]: unknown };
    context?: unknown;
}

/**
 * General purpose menu prompt. By specifying a context object, the buttons in
 * the active prompt can call the corresponding method on the context object.
 * Methods on the contact object should return true in order to complete the
 * prompt.
 *
 * The properties option object may contain the following:
 * activePrompt       - the full prompt to display for the prompted player.
 * waitingPromptTitle - the title to display for opponents.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class MenuPrompt extends UiPrompt {
    player: Player;
    context: MenuContext;
    properties: MenuPromptProperties;

    constructor(game: Game, player: Player, context: MenuContext, properties: MenuPromptProperties) {
        super(game);
        this.player = player;
        this.context = context;
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + (typeof properties.source === 'string' ? properties.source : properties.source.name);
        }
        this.properties = properties;
    }

    activeCondition(player: Player): boolean {
        return player === this.player;
    }

    activePrompt() {
        let promptTitle = this.properties.promptTitle || (this.properties.source && typeof this.properties.source !== 'string' ? this.properties.source.name : undefined);
        return Object.assign({ promptTitle: promptTitle }, this.properties.activePrompt);
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player: Player, arg: string, method: string): boolean {
        const context = this.context as Record<string, MenuCommandHandler>;
        if(!context[method]) {
            return false;
        }

        if(context[method](player, arg, this.properties.context)) {
            this.complete();
        }

        return true;
    }

    hasMethodButton(method: string): boolean {
        return (this.properties.activePrompt.buttons ?? []).some((button: MenuPromptButton) => button.method === method);
    }
}

export default MenuPrompt;
