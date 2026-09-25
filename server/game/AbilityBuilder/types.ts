import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import type { EventName } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { RoleCard } from '../RoleCard.js';
import type { StrongholdCard } from '../StrongholdCard.js';
import type { Utils } from './Utils.js';

export type Period = 'conflict' | 'phase' | 'round' | 'game';
export type Until = 'conflict' | 'phase' | 'round' | 'game' | 'duel';
export type PhaseName = 'dynasty' | 'draw' | 'conflict' | 'fate';
export type CardKind = 'character' | 'attachment' | 'holding' | 'event' | 'province' | 'stronghold' | 'role';

interface CardKindMap {
    character: DrawCard;
    attachment: DrawCard;
    holding: DrawCard;
    event: DrawCard;
    province: ProvinceCard;
    stronghold: StrongholdCard;
    role: RoleCard;
}

export type CardKindInput = CardKind | readonly CardKind[];

export type CardFor<K extends CardKindInput> = K extends readonly (infer U extends CardKind)[]
    ? CardKindMap[U]
    : CardKindMap[K & CardKind];

/** The state that the builder steps collect. */
export interface State {
    source: BaseCard;
    trigger: object;
    costs: object;
    costsFirst: boolean;
    targets: object;
    extras: object;
}

/** An object type without keys. */
export type Empty = Record<never, never>;

export type NoTrigger = Empty;

export interface Triggered<E, M> {
    readonly event: E;
    readonly matched: M;
}

export type With<S extends State, P extends Partial<State>> = Omit<S, keyof P> & P;

/** Always available in the callbacks. */
export interface BaseCtx<Src extends BaseCard> {
    readonly game: Game;
    readonly player: Player;
    readonly opponent: undefined | Player;
    readonly source: Src;
    readonly conflict: undefined | Conflict;

    /** The number of times this ability resolved in the period, before this resolution. */
    timesResolved(period: Period): number;
    /** Escape hatch to the old context. */
    readonly raw: AbilityContext;
}

/** The context in `.condition()`: no costs or targets yet. */
export type ConditionCtx<S extends State> = BaseCtx<S['source']> & S['trigger'] & S['extras'];

/** The context in target filters. Earlier `.targets()` calls are set. Costs can be unpaid. */
export type FilterCtx<S extends State> = ConditionCtx<S> & {
    readonly costs: S['costsFirst'] extends true ? Readonly<S['costs']> : Partial<Readonly<S['costs']>>;
    readonly targets: Readonly<S['targets']>;
};

/** The context in effects and announcements: all is resolved. */
export type Ctx<S extends State> = ConditionCtx<S> & {
    readonly costs: Readonly<S['costs']>;
    readonly targets: Readonly<S['targets']>;
};

export type TriggerCtx<Src extends BaseCard> = BaseCtx<Src>;

export type When<Src extends BaseCard> = {
    [N in EventName]?: (event: GameEvent<N>, ctx: TriggerCtx<Src>, util: Utils) => unknown;
};

type EventByKey = { [N in EventName as `${N}`]: GameEvent<N> };

export type EventOf<W> = { [K in keyof W & keyof EventByKey]: EventByKey[K] }[keyof W & keyof EventByKey];

export type MatchOf<W> = {
    [K in keyof W]: W[K] extends (...args: never[]) => infer R ? Exclude<R, false | undefined | null | 0 | ''> : never;
}[keyof W];

/** The result of a duel. The arrays are empty on a tie. */
export interface DuelOutcome {
    readonly duel: Duel;
    readonly winner: readonly DrawCard[];
    readonly loser: readonly DrawCard[];
    readonly winningPlayer: undefined | Player;
    readonly losingPlayer: undefined | Player;
}

export type PlayerRef<S extends State> = undefined | Player | ((ctx: FilterCtx<S>, util: Utils) => undefined | Player);

export type Amount<S extends State> = number | ((ctx: FilterCtx<S>, util: Utils) => number);
