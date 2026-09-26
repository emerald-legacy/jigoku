import type { AbilityLimit, EventBusLike } from '../../AbilityLimit.js';
import type CardAbility from '../../CardAbility.js';
import type { Conflict } from '../../Conflict.js';
import type Game from '../../Game.js';
import type Player from '../../Player.js';
import type { Period } from '../types.js';

interface Use {
    player: Player;
    round: number;
    phase: string;
    conflict: null | Conflict;
}

/**
 * The uses of one ability, for `ctx.timesResolved`. The engine counts a use after the costs are
 * paid, and resets the limits when the card changes zones (RRG: a new instance of the card).
 */
export class ResolutionHistory {
    private uses: Use[] = [];

    constructor(private readonly game: Game) {}

    record(player: Player): void {
        this.uses.push({
            player,
            round: this.game.roundNumber,
            phase: this.game.currentPhase,
            conflict: this.game.currentConflict
        });
    }

    clear(): void {
        this.uses = [];
    }

    count(player: Player, period: Period): number {
        return this.uses.filter((use) => use.player === player && this.inPeriod(use, period)).length;
    }

    private inPeriod(use: Use, period: Period): boolean {
        switch(period) {
            case 'game':
                return true;
            case 'round':
                return use.round === this.game.roundNumber;
            case 'phase':
                return use.round === this.game.roundNumber && use.phase === this.game.currentPhase;
            case 'conflict':
                return use.conflict !== null && use.conflict === this.game.currentConflict;
        }
    }
}

/** The limit of an ability, with each use also recorded in the history. */
export class RecordingLimit implements AbilityLimit {
    constructor(
        private readonly inner: AbilityLimit,
        private readonly history: ResolutionHistory
    ) {}

    get ability(): undefined | CardAbility {
        return this.inner.ability;
    }

    set ability(ability: undefined | CardAbility) {
        this.inner.ability = ability;
    }

    get currentUser(): null | string {
        return this.inner.currentUser;
    }

    set currentUser(user: null | string) {
        this.inner.currentUser = user;
    }

    get max(): undefined | number {
        return this.inner.max;
    }

    currentForPlayer(player: Player): number {
        return this.inner.currentForPlayer(player);
    }

    clone(): AbilityLimit {
        return new RecordingLimit(this.inner.clone(), this.history);
    }

    isRepeatable(): boolean {
        return this.inner.isRepeatable();
    }

    isAtMax(player: Player): boolean {
        return this.inner.isAtMax(player);
    }

    increment(player: Player): void {
        this.inner.increment(player);
        this.history.record(player);
    }

    reset(): void {
        this.inner.reset();
        this.history.clear();
    }

    registerEvents(bus: EventBusLike): void {
        this.inner.registerEvents(bus);
    }

    unregisterEvents(bus: EventBusLike): void {
        this.inner.unregisterEvents(bus);
    }
}
