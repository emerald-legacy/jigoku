import { msg } from '../GameChat.js';
import { Clock, Mode } from './Clock.js';
import type { ClockInterface } from './types.js';

export class Timer extends Clock implements ClockInterface {
    mode: Mode = 'down';
    name = 'Timer';

    protected timeRanOut() {
        this.player.game.addMessage(msg`${this.player}'s timer has expired`);
    }
}
