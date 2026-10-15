import { msg } from '../GameChat.js';
import type Player from '../Player.js';
import { Clock, type Mode } from './Clock.js';
import type { ClockInterface } from './types.js';

export class ChessClock extends Clock implements ClockInterface {
    override mode: Mode = 'stop';
    override name = 'Chess Clock';

    constructor(player: Player, time: number) {
        super(player, time, 5);
    }

    protected override pause() {
        this.stop();
    }

    protected override restart() {
        this.start();
    }

    public override reset() {
        this.stop();
    }

    public override start() {
        if(!this.manuallyPaused) {
            if(this.mode !== 'down') {
                this.mode = 'down';
                super.start();
            }
        }
    }

    public override stop() {
        super.stop();
        this.mode = 'stop';
    }

    public override opponentStart() {}

    protected override timeRanOut() {
        this.player.game.addMessage(msg`${this.player}'s clock has run out`);
        if(this.player.opponent && this.player.opponent.clock.timeLeft > 0) {
            this.player.game.recordWinner(this.player.opponent, 'clock');
        }
    }

    protected override updateTimeLeft(secs: number) {
        if(this.timeLeft === 0 || secs < 0) {
            return;
        }
        const delay = this.delayToStartClock ?? 0;
        if(secs <= delay) {
            return;
        }

        secs = secs - delay;
        if(this.mode === 'down') {
            this.modify(-secs);
            if(this.timeLeft < 0) {
                this.timeLeft = 0;
                this.timeRanOut();
            }
        } else if(this.mode === 'up') {
            this.modify(secs);
        }
    }
}
