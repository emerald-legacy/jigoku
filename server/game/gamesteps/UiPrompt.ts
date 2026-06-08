import { v1 as uuid } from 'uuid';
import type Player from '../Player.js';
import { BaseStep } from './BaseStep.js';

type PromptButton = { text?: string | number; arg?: string | number; command?: string; uuid?: string; [key: string]: unknown };
type PromptControl = { type: string; source: unknown; targets: unknown; uuid?: string; [key: string]: unknown };

type ActivePrompt = {
    buttons?: Array<PromptButton>;
    menuTitle?: string;
    promptTitle?: string;

    controls?: Array<PromptControl>;
    selectCard?: boolean;
    selectOrder?: boolean;
    selectRing?: boolean;
    [key: string]: unknown;
};

export class UiPrompt extends BaseStep {
    public completed = false;
    public uuid = uuid();

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

    public onMenuCommand(player: Player, arg: string, uuid: string, method: string): boolean {
        if(!this.activeCondition(player) || uuid !== this.uuid) {
            return false;
        }

        return this.menuCommand(player, arg, method);
    }

    menuCommand(_player: Player, _arg: string, _method: string): boolean {
        return true;
    }
}
