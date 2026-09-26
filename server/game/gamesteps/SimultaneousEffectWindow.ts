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
    // unset while the first player is not chosen yet (during setup)
    currentPlayer: Player | undefined;

    constructor(game: Game) {
        super(game);
        this.currentPlayer = this.game.getFirstPlayer();
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
        const player = this.currentPlayer;
        if(choices.length === 1 || !player || !player.optionSettings.orderForcedAbilities) {
            this.resolveEffect(choices[0]);
        } else {
            this.promptBetweenChoices(player, choices);
        }
        return false;
    }

    promptBetweenChoices(player: Player, choices: SimultaneousEffectChoice[]): void {
        this.game.promptWithHandlerMenu(player, {
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
