import type BaseCard from '../BaseCard.js';
import type { Duel } from '../Duel.js';
import type { EventName } from '../Constants.js';
import type { GameEvent } from '../Events/EventPayloads.js';
import type { CostKit, CostSpec } from './kits/CostKit.js';
import type { EffectKit, EffectNode } from './kits/EffectKit.js';
import type { FinishOptions, LimitKit } from './kits/LimitKit.js';
import type { FreeformMessage, MessageKit, MessageResult, NoMessage, WithIntroMessage } from './kits/MessageKit.js';
import type { TargetKit, TargetSpec } from './kits/TargetKit.js';
import type { Utils } from './Utils.js';
import type {
    ConditionCtx,
    Ctx,
    DuelOutcome,
    Empty,
    EventOf,
    MatchOf,
    NoTrigger,
    PhaseName,
    State,
    Triggered,
    When,
    With
} from './types.js';

export type Zone =
    | 'hand'
    | 'playArea'
    | 'provinces'
    | 'dynastyDiscardPile'
    | 'conflictDiscardPile'
    | 'dynastyDeck'
    | 'conflictDeck'
    | 'removedFromGame';

export type Finish = 'printed' | 'gained';

type CostResults<C> = { readonly [K in keyof C]: C[K] extends CostSpec<infer R> ? R : never };
type TargetResults<T> = { readonly [K in keyof T]: T[K] extends TargetSpec<infer R> ? R : never };

/**
 * The context in `.effects()`. Costs can be unpaid, because the engine also runs the effects
 * to check that the ability can change the game state before the costs are paid.
 */
export type EffectCtx<S extends State> = ConditionCtx<S> & {
    readonly costs: Partial<Readonly<S['costs']>>;
    readonly targets: Readonly<S['targets']>;
};

type EffectsFn<S extends State> = ($effect: EffectKit, ctx: EffectCtx<S>, util: Utils) => readonly EffectNode[];
type AnnounceFn<S extends State, R> = ($message: MessageKit, ctx: Ctx<S>, util: Utils) => R;
type LimitsFn = ($limit: LimitKit) => FinishOptions;

/** The announcement of the first step must start with the intro. */
export type FirstAnnouncement = WithIntroMessage | readonly [WithIntroMessage, ...(FreeformMessage | NoMessage)[]];

declare const gainedSource: unique symbol;

/** A gained ability, ready for `$modifier.gainAbility`. */
export interface GainedAbility<Src extends BaseCard> {
    readonly [gainedSource]: Src;
}

type FinishOf<F extends Finish, Src extends BaseCard> = F extends 'printed'
    ? { addPrinted(limits?: LimitsFn): void }
    : { build(limits?: LimitsFn): GainedAbility<Src> };

type Next<S extends State, T> = With<S, { targets: S['targets'] & TargetResults<T> }>;
type WithDuel<S extends State> = With<S, { extras: S['extras'] & { duel: DuelOutcome } }>;

export interface DuelOptions {
    challenger?: (card: BaseCard) => boolean;
    challenged?: (card: BaseCard) => boolean;
    requiresConflict?: boolean;
    /**
     * "between two characters controlled by different players, even if you do not control either".
     * With two players, this is the same as the default duel, so the adapter does not use it yet.
     */
    anyControllers?: boolean;
}

export interface Setup<S extends State, F extends Finish> extends Targeting<S, F> {
    title(text: string): Setup<S, F>;
    condition(fn: (ctx: ConditionCtx<S>, util: Utils) => boolean): Setup<S, F>;
    /** Where the source card must be. The default depends on the card type. */
    from(...zones: Zone[]): Setup<S, F>;
    duringPhase(phase: PhaseName): Setup<S, F>;
    payCostsBeforeTargets(): Setup<With<S, { costsFirst: true }>, F>;
    costs<const C extends Record<string, CostSpec<unknown>>>(
        costs: ($cost: CostKit<S>) => C
    ): Targeting<With<S, { costs: CostResults<C> }>, F>;
}

export interface Targeting<S extends State, F extends Finish> {
    /** Slots in one call are independent. A later call depends on the earlier calls. */
    targets<const T extends Record<string, TargetSpec<unknown>>>(
        targets: ($target: TargetKit<S>) => T
    ): Targeting<Next<S, T>, F>;
    militaryDuel(options?: DuelOptions): DuelStep<WithDuel<S>, F>;
    politicalDuel(options?: DuelOptions): DuelStep<WithDuel<S>, F>;
    gloryDuel(options?: DuelOptions): DuelStep<WithDuel<S>, F>;
    announce(fn: AnnounceFn<S, FirstAnnouncement>): Announced<S, F>;
    effects(fn: EffectsFn<S>): Resolving<S, F>;
}

export interface Announced<S extends State, F extends Finish> {
    effects(fn: EffectsFn<S>): Resolving<S, F>;
}

/** The step that runs when the duel resolves. */
export interface DuelStep<S extends State, F extends Finish> {
    announce(fn: AnnounceFn<S, MessageResult>): Announced<S, F>;
    effects(fn: EffectsFn<S>): Resolving<S, F>;
}

export type Resolving<S extends State, F extends Finish> = FinishOf<F, S['source']> & {
    then(): Step<S, F>;
    ifYouDo(): Branch<S, F>;
    thenIf(condition: ($effect: EffectKit, ctx: Ctx<S>, util: Utils) => boolean): Branch<S, F>;
};

export interface Step<S extends State, F extends Finish> {
    targets<const T extends Record<string, TargetSpec<unknown>>>(targets: ($target: TargetKit<S>) => T): Step<Next<S, T>, F>;
    announce(fn: AnnounceFn<S, MessageResult>): StepAnnounced<S, F>;
    effects(fn: EffectsFn<S>): Resolving<S, F>;
}

/** After an announcement, the effects are optional. */
export type StepAnnounced<S extends State, F extends Finish> = Resolving<S, F> & {
    effects(fn: EffectsFn<S>): Resolving<S, F>;
};

export interface Branch<S extends State, F extends Finish> {
    announce(fn: AnnounceFn<S, MessageResult>): BranchAnnounced<S, F>;
    effects(fn: EffectsFn<S>): BranchResolving<S, F>;
}

export type BranchResolving<S extends State, F extends Finish> = Resolving<S, F> & {
    otherwise(): Step<S, F>;
};

export type BranchAnnounced<S extends State, F extends Finish> = BranchResolving<S, F> & {
    effects(fn: EffectsFn<S>): BranchResolving<S, F>;
};

type Init<Src extends BaseCard, T, X = Empty> = {
    source: Src;
    trigger: T;
    costs: Empty;
    costsFirst: false;
    targets: Empty;
    extras: X;
};

type TriggerSetup<Src extends BaseCard, W, F extends Finish> = Setup<Init<Src, Triggered<EventOf<W>, MatchOf<W>>>, F>;
type DuelWindowSetup<Src extends BaseCard, N extends EventName, F extends Finish> = Setup<
    Init<Src, Triggered<GameEvent<N>, true>, { duel: Duel }>,
    F
>;

export interface AbilityEntry<Src extends BaseCard, F extends Finish> {
    action(): Setup<Init<Src, NoTrigger>, F>;
    /** "Conflict Action": the RRG meaning for the source card type. */
    conflictAction(): Setup<Init<Src, NoTrigger>, F>;
    militaryConflictAction(): Setup<Init<Src, NoTrigger>, F>;
    politicalConflictAction(): Setup<Init<Src, NoTrigger>, F>;

    reaction<const W extends When<Src>>(when: W): TriggerSetup<Src, W, F>;
    forcedReaction<const W extends When<Src>>(when: W): TriggerSetup<Src, W, F>;
    interrupt<const W extends When<Src>>(when: W): TriggerSetup<Src, W, F>;
    wouldInterrupt<const W extends When<Src>>(when: W): TriggerSetup<Src, W, F>;
    forcedInterrupt<const W extends When<Src>>(when: W): TriggerSetup<Src, W, F>;

    duelChallenge(): DuelWindowSetup<Src, EventName.OnDuelChallenge, F>;
    duelFocus(): DuelWindowSetup<Src, EventName.OnDuelFocus, F>;
    duelStrike(): DuelWindowSetup<Src, EventName.OnDuelStrike, F>;
}

// ---- The recorded spec. The adapter compiles it to old-style props. ----

export type AbilityKind =
    | 'action'
    | 'reaction'
    | 'forcedReaction'
    | 'interrupt'
    | 'wouldInterrupt'
    | 'forcedInterrupt'
    | 'duelChallenge'
    | 'duelFocus'
    | 'duelStrike';

export type Gate =
    | { type: 'first' }
    | { type: 'then' }
    | { type: 'ifYouDo' }
    | { type: 'thenIf'; condition: (...args: never[]) => boolean }
    | { type: 'otherwise' };

export interface StepSpec {
    gate: Gate;
    targetGroups: (($target: never) => Record<string, TargetSpec<unknown>>)[];
    announce?: (...args: never[]) => MessageResult;
    effects?: (...args: never[]) => readonly EffectNode[];
    duel?: { type: 'military' | 'political' | 'glory'; options: DuelOptions };
}

export interface AbilitySpec {
    kind: AbilityKind;
    conflict?: { type?: 'military' | 'political' };
    when?: Record<string, (...args: never[]) => unknown>;
    title?: string;
    conditions: ((...args: never[]) => boolean)[];
    zones?: Zone[];
    phase?: PhaseName;
    costsFirst: boolean;
    costs?: ($cost: never) => Record<string, CostSpec<unknown>>;
    steps: StepSpec[];
}

export type Register = (spec: AbilitySpec, limits: FinishOptions) => void;
export type Build = (spec: AbilitySpec, limits: FinishOptions) => unknown;

/** Records the builder calls into an `AbilitySpec`. The interfaces above give the call order and the types. */
export class TriggeredBuilder {
    private readonly spec: AbilitySpec;

    constructor(
        kind: AbilityKind,
        private readonly finish: { register?: Register; build?: Build; limitKit: LimitKit },
        extra: Partial<AbilitySpec> = {}
    ) {
        this.spec = {
            kind,
            conditions: [],
            costsFirst: false,
            steps: [{ gate: { type: 'first' }, targetGroups: [] }],
            ...extra
        };
    }

    private get step(): StepSpec {
        return this.spec.steps[this.spec.steps.length - 1];
    }

    title(text: string): this {
        this.spec.title = text;
        return this;
    }

    condition(fn: (...args: never[]) => boolean): this {
        this.spec.conditions.push(fn);
        return this;
    }

    from(...zones: Zone[]): this {
        this.spec.zones = zones;
        return this;
    }

    duringPhase(phase: PhaseName): this {
        this.spec.phase = phase;
        return this;
    }

    payCostsBeforeTargets(): this {
        this.spec.costsFirst = true;
        return this;
    }

    costs(fn: ($cost: never) => Record<string, CostSpec<unknown>>): this {
        if(this.spec.costs) {
            throw new Error('Ability builder: costs() can be called only once');
        }
        this.spec.costs = fn;
        return this;
    }

    targets(fn: ($target: never) => Record<string, TargetSpec<unknown>>): this {
        this.step.targetGroups.push(fn);
        return this;
    }

    militaryDuel(options: DuelOptions = {}): this {
        this.step.duel = { type: 'military', options };
        return this;
    }

    politicalDuel(options: DuelOptions = {}): this {
        this.step.duel = { type: 'political', options };
        return this;
    }

    gloryDuel(options: DuelOptions = {}): this {
        this.step.duel = { type: 'glory', options };
        return this;
    }

    announce(fn: (...args: never[]) => MessageResult): this {
        this.step.announce = fn;
        return this;
    }

    effects(fn: (...args: never[]) => readonly EffectNode[]): this {
        this.step.effects = fn;
        return this;
    }

    then(): this {
        return this.addStep({ type: 'then' });
    }

    ifYouDo(): this {
        return this.addStep({ type: 'ifYouDo' });
    }

    thenIf(condition: (...args: never[]) => boolean): this {
        return this.addStep({ type: 'thenIf', condition });
    }

    otherwise(): this {
        return this.addStep({ type: 'otherwise' });
    }

    addPrinted(limits?: ($limit: LimitKit) => FinishOptions): void {
        if(!this.finish.register) {
            throw new Error('Ability builder: a gained ability uses build(), not addPrinted()');
        }
        this.finish.register(this.spec, limits?.(this.finish.limitKit) ?? {});
    }

    build(limits?: ($limit: LimitKit) => FinishOptions): unknown {
        if(!this.finish.build) {
            throw new Error('Ability builder: a printed ability uses addPrinted(), not build()');
        }
        return this.finish.build(this.spec, limits?.(this.finish.limitKit) ?? {});
    }

    private addStep(gate: Gate): this {
        this.spec.steps.push({ gate, targetGroups: [] });
        return this;
    }
}
