import { EffectName, EventName } from '../../Constants.js';
import { parseGameMode } from '../../GameMode.js';
import type Game from '../../Game.js';
import type { Event } from '../../Events/Event.js';
import type { GameEvent } from '../../Events/EventPayloads.js';
import ActionWindow from '../ActionWindow.js';

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

        if(parseGameMode(this.game.gameMode).dynastyPhasePassingFate) {
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
        this.game.addMessage('{0} is the first to pass, and gains 1 fate', this.currentPlayer);
        this.game.raiseEvent(
            EventName.OnPassDuringDynasty,
            { player: this.currentPlayer, firstToPass: true },
            (event: Event) => (event as GameEvent<EventName.OnPassDuringDynasty>).player?.modifyFate(1)
        );
    }

    #handleSimplePass(): void {
        this.game.addMessage('{0} passes', this.currentPlayer);
        this.game.raiseEvent(EventName.OnPassDuringDynasty, { player: this.currentPlayer, firstToPass: false });
    }

    #checkPhaseRestart() {
        if(
            this.currentPlayer.anyEffect(EffectName.RestartDynastyPhase) ||
            this.currentPlayer.opponent?.anyEffect?.(EffectName.RestartDynastyPhase)
        ) {
            const effectSource = this.currentPlayer.mostRecentEffect(EffectName.RestartDynastyPhase);
            this.game.addMessage('The dynasty phase is ended due to the effects of {0}', effectSource);
            this.complete();
        }
    }
}
