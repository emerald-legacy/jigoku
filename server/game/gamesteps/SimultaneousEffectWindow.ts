import { BaseStep } from './BaseStep.js';
import type Game from '../Game.js';
import type Player from '../Player.js';

export interface SimultaneousEffectChoiceInput {
    condition?: () => boolean;
    title: string;
    handler: () => void;
}

interface SimultaneousEffectChoice {
    condition: () => boolean;
    title: string;
    handler: () => void;
}

class SimultaneousEffectWindow extends BaseStep {
    choices: SimultaneousEffectChoice[] = [];
    currentPlayer: Player;

    constructor(game: Game) {
        super(game);
        this.currentPlayer = this.game.getFirstPlayer() as Player;
    }

    continue(): boolean {
        this.game.currentAbilityWindow = this;
        if(this.filterChoices()) {
            this.game.currentAbilityWindow = null;
            return true;
        }
        return false;
    }

    addChoice(choice: SimultaneousEffectChoiceInput): void {
        this.choices.push({
            condition: choice.condition ?? (() => true),
            title: choice.title,
            handler: choice.handler
        });
    }

    filterChoices(): boolean {
        let choices = this.choices.filter((choice) => choice.condition());
        if(choices.length === 0) {
            return true;
        }
        if(choices.length === 1 || !this.currentPlayer.optionSettings.orderForcedAbilities) {
            this.resolveEffect(choices[0]);
        } else {
            this.promptBetweenChoices(choices);
        }
        return false;
    }

    promptBetweenChoices(choices: SimultaneousEffectChoice[]): void {
        this.game.promptWithHandlerMenu(this.currentPlayer, {
            source: 'Order Simultaneous effects',
            activePromptTitle: 'Choose an effect to be resolved',
            waitingPromptTitle: 'Waiting for opponent',
            choices: choices.map(choice => choice.title),
            handlers: choices.map(choice => (() => this.resolveEffect(choice)))
        });
    }

    resolveEffect(choice: SimultaneousEffectChoice): void {
        this.choices = this.choices.filter(c => c !== choice);
        choice.handler();
    }
}

export default SimultaneousEffectWindow;
