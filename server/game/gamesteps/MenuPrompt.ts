import { type ActivePrompt, UiPrompt } from './UiPrompt.js';
import type Player from '../Player.js';
import type Game from '../Game.js';

/** Called for a button or control naming it, with the button's `arg`; returning true completes the prompt. */
export type MenuHandler = (player: Player, arg: string) => boolean;

/** The handlers a prompt's buttons and controls name, by method name. */
export type MenuHandlers = Record<string, MenuHandler>;

export interface MenuPromptProperties {
    /** What the prompt is for, usually a card; gives the default waiting title. */
    source?: { name: string } | string;
    waitingPromptTitle?: string;
    promptTitle?: string;
    /** The prompt shown to the prompted player; its buttons and controls name a handler in `method`. */
    activePrompt: ActivePrompt;
}

/** A menu whose buttons and controls call the handlers given for it, nothing else. */
export class MenuPrompt extends UiPrompt {
    player: Player;
    handlers: MenuHandlers;
    properties: MenuPromptProperties;

    constructor(game: Game, player: Player, handlers: MenuHandlers, properties: MenuPromptProperties) {
        super(game);
        this.player = player;
        this.handlers = handlers;
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
        const handler = Object.hasOwn(this.handlers, method) ? this.handlers[method] : undefined;
        if(!handler) {
            return false;
        }

        if(handler(player, arg)) {
            this.complete();
        }

        return true;
    }

    /** Whether a button or control of this prompt sends `method` (with `arg`, where every such button fixes it): the client names it. */
    private offers(method: string, arg: string): boolean {
        const { buttons = [], controls = [] } = this.properties.activePrompt;
        const buttonArgs = buttons.filter((button) => button.method === method).map((button) => button.arg);
        if(controls.some((control) => control.method === method) || buttonArgs.some((buttonArg) => buttonArg === undefined)) {
            return true;
        }
        return buttonArgs.some((buttonArg) => String(buttonArg) === String(arg));
    }
}

