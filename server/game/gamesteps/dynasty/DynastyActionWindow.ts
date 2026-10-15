import { msg } from '../../GameChat.js';
import { EffectName, EventName } from '../../Constants.js';
import type Game from '../../Game.js';
import { ActionWindow } from '../ActionWindow.js';

export class DynastyActionWindow extends ActionWindow {
    constructor(game: Game) {
        super(game, 'Play cards from provinces', 'dynasty');
    }

    activePrompt() {
        return {
            menuTitle: 'Click pass when done',
            buttons: super.activePrompt().buttons,
            promptTitle: this.title
        };
    }

    pass() {
        this.currentPlayer.passDynasty();

        if(this.#opponentPassed()) {
            this.#handleSimplePass();
            return this.complete();
        }

        if(this.game.rules.dynastyPhasePassingFate) {
            this.#handlePassingFate();
        } else {
            this.#handleSimplePass();
        }

        this.nextPlayer();
    }

    nextPlayer() {
        this.#checkPhaseRestart();

        const otherPlayer = this.currentPlayer.opponent;
        if(otherPlayer && !otherPlayer.passedDynasty) {
            this.currentPlayer = otherPlayer;
        }
    }

    #opponentPassed(): boolean {
        return this.currentPlayer.opponent?.passedDynasty ?? true;
    }

    #handlePassingFate(): void {
        this.game.addMessage(msg`${this.currentPlayer} is the first to pass, and gains 1 fate`);
        this.game.raiseEvent(
            EventName.OnPassDuringDynasty,
            { player: this.currentPlayer, firstToPass: true },
            (event) => event.player.modifyFate(1)
        );
    }

    #handleSimplePass(): void {
        this.game.addMessage(msg`${this.currentPlayer} passes`);
        this.game.raiseEvent(EventName.OnPassDuringDynasty, { player: this.currentPlayer, firstToPass: false });
    }

    #checkPhaseRestart() {
        if(
            this.currentPlayer.anyEffect(EffectName.RestartDynastyPhase) ||
            this.currentPlayer.opponent?.anyEffect?.(EffectName.RestartDynastyPhase)
        ) {
            const effectSource = this.currentPlayer.mostRecentEffect(EffectName.RestartDynastyPhase);
            this.game.addMessage(msg`The dynasty phase is ended due to the effects of ${effectSource}`);
            this.complete();
        }
    }
}
