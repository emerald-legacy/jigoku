import { type ActivePrompt, UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';

type MenuContext = object;

interface MenuPromptProperties {
    source?: { name: string } | string;
    waitingPromptTitle?: string;
    promptTitle?: string;
    activePrompt: ActivePrompt;
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
        const promptTitle = this.properties.promptTitle || (this.properties.source && typeof this.properties.source !== 'string' ? this.properties.source.name : undefined);
        return Object.assign({ promptTitle: promptTitle }, this.properties.activePrompt);
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    menuCommand(player: Player, arg: string, method: string): boolean {
        if(!this.offers(method, arg)) {
            return false;
        }
        const context = this.context;
        // a method on the context object, named by the button
        const handler: unknown = Reflect.get(context, method);
        if(typeof handler !== 'function') {
            return false;
        }

        if(handler.call(context, player, arg, this.properties.context)) {
            this.complete();
        }

        return true;
    }

    /**
     * Whether a button or control of this prompt sends `method` (with `arg`, where every such button fixes it):
     * the client names the method, and the context object has many more than the prompt offers.
     */
    private offers(method: string, arg: string): boolean {
        const { buttons = [], controls = [] } = this.properties.activePrompt;
        const buttonArgs = buttons.filter((button) => button.method === method).map((button) => button.arg);
        if(controls.some((control) => control.method === method) || buttonArgs.some((buttonArg) => buttonArg === undefined)) {
            return true;
        }
        return buttonArgs.some((buttonArg) => String(buttonArg) === String(arg));
    }
}

export default MenuPrompt;
