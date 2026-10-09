import { randomUUID } from 'crypto';
import type Player from '../Player.js';
import { BaseStep } from './BaseStep.js';
import type { MenuArg } from './Step.js';
import type { PromptButton, PromptControl } from '../PlayerPromptState.js';

export type ActivePrompt = {
    buttons?: Array<PromptButton>;
    menuTitle?: string;
    promptTitle?: string;

    controls?: Array<PromptControl>;
    selectCard?: boolean;
    selectOrder?: boolean;
    selectRing?: boolean;
};

export class UiPrompt extends BaseStep {
    public completed = false;
    public uuid: string = randomUUID();

    isComplete(): boolean {
        return this.completed;
    }

    complete(): void {
        this.completed = true;
    }

    setPrompt(): void {
        for(const player of this.game.getPlayers()) {
            if(this.activeCondition(player)) {
                const activePrompt = this.addDefaultCommandToButtons(this.activePrompt(player));
                if(activePrompt) {
                    player.setPrompt(activePrompt);
                }
                player.startClock();
            } else {
                player.setPrompt(this.waitingPrompt());
                player.resetClock();
            }
        }
    }

    activeCondition(_player: Player): boolean {
        return true;
    }

    activePrompt(_player: Player): undefined | ActivePrompt {
        return undefined;
    }

    addDefaultCommandToButtons(original?: ActivePrompt) {
        if(!original) {
            return undefined;
        }

        const newPrompt = { ...original };
        if(newPrompt.buttons) {
            for(const button of newPrompt.buttons) {
                button.command = button.command || 'menuButton';
                button.uuid = this.uuid;
            }
        }

        if(newPrompt.controls) {
            for(const controls of newPrompt.controls) {
                controls.uuid = this.uuid;
            }
        }
        return newPrompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    public continue(): boolean {
        const completed = this.isComplete();

        if(completed) {
            this.clearPrompts();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts(): void {
        for(const player of this.game.getPlayers()) {
            player.cancelPrompt();
        }
    }

    public onMenuCommand(player: Player, arg: MenuArg, uuid: string, method?: string | null): boolean {
        if(!this.activeCondition(player) || uuid !== this.uuid) {
            return false;
        }

        return this.menuCommand(player, arg, method);
    }

    menuCommand(_player: Player, _arg: MenuArg, _method?: string | null): boolean {
        return true;
    }
}
