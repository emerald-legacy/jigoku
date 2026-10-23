import type { Phase } from './Constants.js';

interface HonorEvent {
    amount: number;
    phase: Phase | '';
    round: number;
}

export class HonorTracker {
    honor: number = 0;
    private honorEvents: HonorEvent[] = [];

    modifyHonor(amount: number, phase: Phase | '', round: number): void {
        this.honor = Math.max(0, this.honor + amount);
        this.honorEvents.push({ amount, phase, round });
    }

    honorGained(round: number | null = null, phase: Phase | '' | null = null, onlyPositive: boolean = false): number {
        return this.honorEvents
            .filter((event) => !round || event.round === round)
            .filter((event) => !phase || event.phase === phase)
            .filter((event) => !onlyPositive || event.amount > 0)
            .reduce((total, event) => total + event.amount, 0);
    }

    resetHonorEvents(round: number, phase: Phase): void {
        this.honorEvents = this.honorEvents.filter((event) => event.round !== round || event.phase !== phase);
    }

    getTotalHonor(): number {
        return this.honor;
    }
}
