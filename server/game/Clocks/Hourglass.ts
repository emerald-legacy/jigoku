import { ChessClock } from './ChessClock.js';
import type { ClockInterface } from './types.js';

export class Hourglass extends ChessClock implements ClockInterface {
    override name = 'Hourglass';

    override opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}
