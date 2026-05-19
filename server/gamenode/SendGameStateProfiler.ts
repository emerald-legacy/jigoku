import { logger } from '../logger.js';

/**
 * Lightweight profiler for sendGameState. Collects per-phase timings and
 * logs aggregate percentiles every `flushEvery` samples. Enabled via the
 * `PROFILE_GAMESTATE=1` env var; a no-op otherwise.
 *
 * Phase semantics:
 *  - sharedState:  game.getSharedState() build time
 *  - hiddenInfo:   recordHiddenInfoIfChanged() time (fingerprint + snapshot)
 *  - perViewer:    total time across all player getState() calls
 *  - spectator:    spectator state build time (single shared computation)
 *  - send:         socket.send() wire time for all recipients
 *  - total:        end-to-end sendGameState duration
 */
export class SendGameStateProfiler {
    public readonly enabled: boolean;
    private readonly flushEvery: number;
    private samples: Sample[] = [];

    public constructor(flushEvery = 200) {
        this.enabled = process.env.PROFILE_GAMESTATE === '1';
        this.flushEvery = flushEvery;
    }

    public now(): bigint {
        return process.hrtime.bigint();
    }

    public record(sample: Sample): void {
        if(!this.enabled) {
            return;
        }
        this.samples.push(sample);
        if(this.samples.length >= this.flushEvery) {
            this.flush();
        }
    }

    private flush(): void {
        const batch = this.samples;
        this.samples = [];
        logger.info(this.format(batch));
    }

    private format(batch: Sample[]): string {
        const phases: (keyof Sample)[] = ['sharedState', 'hiddenInfo', 'perViewer', 'spectator', 'send', 'total'];
        const parts = phases.map((phase) => {
            const values = batch.map((s) => Number(s[phase] ?? 0)).filter((v) => v > 0).sort((a, b) => a - b);
            if(values.length === 0) {
                return `${phase}=n/a`;
            }
            const p = (q: number) => values[Math.min(values.length - 1, Math.floor(values.length * q))];
            return `${phase}=${usFromNs(p(0.5))}/${usFromNs(p(0.95))}/${usFromNs(p(0.99))}us(p50/p95/p99)`;
        });
        const avgPlayers = avg(batch.map((s) => s.players));
        const avgSpectators = avg(batch.map((s) => s.spectators));
        return `[sendGameState] n=${batch.length} players~${avgPlayers.toFixed(1)} spectators~${avgSpectators.toFixed(1)} ${parts.join(' ')}`;
    }
}

export interface Sample {
    sharedState: bigint;
    hiddenInfo: bigint;
    perViewer: bigint;
    spectator: bigint;
    send: bigint;
    total: bigint;
    players: number;
    spectators: number;
}

function usFromNs(ns: number): number {
    return Math.round(ns / 1000);
}

function avg(values: number[]): number {
    if(values.length === 0) {
        return 0;
    }
    return values.reduce((a, b) => a + b, 0) / values.length;
}
