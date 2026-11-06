import { BaseStep } from './BaseStep.js';
import type Game from '../Game.js';
import type Player from '../Player.js';

export interface SimultaneousEffectChoiceInput {
    condition?: () => boolean;
    title: string;
    handler: () => void;
    // whose effect it is
    player?: Player;
}

interface SimultaneousEffectChoice {
    condition: () => boolean;
    title: string;
    handler: () => void;
    player?: Player;
}

export class SimultaneousEffectWindow extends BaseStep {
    choices: SimultaneousEffectChoice[] = [];
    // unset while the first player is not chosen yet (during setup)
    currentPlayer: Player | undefined;

    constructor(game: Game) {
        super(game);
        this.currentPlayer = this.game.getFirstPlayer();
    }

    abort(): void {
        if(this.game.currentAbilityWindow === this) {
            this.game.currentAbilityWindow = null;
        }
    }

    override continue(): boolean {
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
            handler: choice.handler,
            player: choice.player
        });
    }

    filterChoices(): boolean {
        const choices = this.choices.filter((choice) => choice.condition());
        if(choices.length === 0) {
            return true;
        }
        // RRG: the first player orders delayed effects, regardless of who controls them; one player's own effects (several ring effects) they order themselves
        const severalPlayers = new Set(choices.map((choice) => choice.player)).size > 1;
        const player = severalPlayers ? this.currentPlayer : choices[0].player ?? this.currentPlayer;
        if(choices.length === 1 || !player || (!severalPlayers && !player.optionSettings.orderForcedAbilities)) {
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
            options: choices.map((choice) => ({ text: choice.title, handler: () => this.resolveEffect(choice) }))
        });
    }

    resolveEffect(choice: SimultaneousEffectChoice): void {
        this.choices = this.choices.filter((c) => c !== choice);
        choice.handler();
    }
}

