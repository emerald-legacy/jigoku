interface HonorEvent {
    amount: number;
    phase: string;
    round: number;
}

export class HonorTracker {
    honor: number = 0;
    private honorEvents: HonorEvent[] = [];

    modifyHonor(amount: number, phase: string, round: number): void {
        this.honor = Math.max(0, this.honor + amount);
        this.honorEvents.push({ amount, phase, round });
    }

    honorGained(round: number | null = null, phase: string | null = null, onlyPositive: boolean = false): number {
        return this.honorEvents
            .filter((event) => !round || event.round === round)
            .filter((event) => !phase || event.phase === phase)
            .filter((event) => !onlyPositive || event.amount > 0)
            .reduce((total, event) => total + event.amount, 0);
    }

    resetHonorEvents(round: number, phase: string): void {
        this.honorEvents = this.honorEvents.filter((event) => event.round !== round && event.phase !== phase);
    }

    getTotalHonor(): number {
        return this.honor;
    }

    reset(): void {
        this.honor = 0;
        this.honorEvents = [];
    }
}
