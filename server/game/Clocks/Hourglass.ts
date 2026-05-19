import { ChessClock } from './ChessClock.js';
import type { ClockInterface } from './types.js';

export class Hourglass extends ChessClock implements ClockInterface {
    name = 'Hourglass';

    opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}
