import { msg } from '../GameChat.js';
import { Clock, type Mode } from './Clock.js';
import type { ClockInterface } from './types.js';

export class Timer extends Clock implements ClockInterface {
    override mode: Mode = 'down';
    override name = 'Timer';

    protected override timeRanOut() {
        this.player.game.addMessage(msg`${this.player}'s timer has expired`);
    }
}
