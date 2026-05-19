import ForcedTriggeredAbilityWindow from './forcedtriggeredabilitywindow.js';

class SimultaneousEffectWindow extends ForcedTriggeredAbilityWindow {
    constructor(game: any) {
        super(game, 'delayedeffects' as any, undefined as any);
    }

    addChoice(choice: any): void {
        if(!choice.condition) {
            choice.condition = () => true;
        }
        this.choices.push(choice);
    }

    filterChoices(): boolean {
        let choices = this.choices.filter(choice => choice.condition());
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

    promptBetweenChoices(choices: any[]): void {
        this.game.promptWithHandlerMenu(this.currentPlayer, {
            source: 'Order Simultaneous effects',
            activePromptTitle: 'Choose an effect to be resolved',
            waitingPromptTitle: 'Waiting for opponent',
            choices: choices.map(choice => choice.title),
            handlers: choices.map(choice => (() => this.resolveEffect(choice)))
        });
    }

    resolveEffect(choice: any): void {
        this.choices = this.choices.filter(c => c !== choice);
        choice.handler();
    }
}

export default SimultaneousEffectWindow;
