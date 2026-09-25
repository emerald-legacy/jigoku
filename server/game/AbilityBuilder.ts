import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import BaseCard from './BaseCard.js';
import { CardType, type EventName, type Location, type Phases, type Players, TargetMode } from './Constants.js';
import type { Cost } from './costs/Cost.js';
import type DrawCard from './DrawCard.js';
import type { GameEvent } from './Events/EventPayloads.js';
import { GameAction } from './GameActions/GameAction.js';
import type { ActionProps, EffectArg, InitiateDuel, TriggeredAbilityWhenProps, WhenType } from './Interfaces.js';
import type { ProvinceCard } from './ProvinceCard.js';
import Ring from './Ring.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';

type CardOfOne<K> = K extends CardType.Province ? ProvinceCard : K extends CardType ? DrawCard : BaseCard;
/** The card class a target declared with `cardType: K` can hold. */
export type CardOfType<K> = [K] extends [never] ? BaseCard : K extends readonly (infer E)[] ? CardOfOne<E> : CardOfOne<K>;
/** What a card target holds once chosen: the engine stores `[]` when an optional one is skipped. */
type ChosenCard<K, O> = true extends O ? CardOfType<K> | [] : CardOfType<K>;

/**
 * What a builder callback receives: the ability's context plus the targets and cost results it can
 * rely on at that point. Cost results are only known once paid, so they are optional.
 */
export type BuilderContext<Base extends AbilityContext, TG, RG, CO> =
    Base & { targets: TG; rings: RG; costs: Partial<CO> } & NamedTarget<TG> & NamedRing<RG>;

/** The engine mirrors a target named `target` onto `context.target`, and a ring target of that name onto `context.ring`. */
type NamedTarget<TG> = TG extends { target: infer T } ? { target: T } : unknown;
type NamedRing<RG> = RG extends { target: infer R } ? { ring: R } : unknown;

/**
 * An action that accepts the builder's context. One method only: TypeScript infers the context of
 * `AbilityDsl.actions.x((context) => ...)` from it exactly, and, since methods compare bivariantly,
 * an action built for a wider context fits too.
 */
interface BuilderAction<Base extends AbilityContext, TG, RG, CO> {
    hasLegalTarget(context: BuilderContext<Base, TG, RG, CO>, additionalProperties?: object): boolean;
}

function toGameAction(title: string, action: object): GameAction {
    if(!(action instanceof GameAction)) {
        throw new Error(`${title}: not a game action`);
    }
    return action;
}

/**
 * What a target's own callbacks can rely on: the target it depends on is set, other earlier ones
 * may not be (the engine checks independent targets on their own), and itself is the candidate.
 */
type Visible<Bag, D extends keyof Bag, Name extends string, V> = Pick<Bag, D> & Partial<Omit<Bag, D>> & { [P in Name]: V };
type Earlier<Bag, D extends keyof Bag> = Pick<Bag, D> & Partial<Omit<Bag, D>>;

/** The context of an action declared with a builder: it is always resolved as a `CardAction`. */
export type ActionContext<S extends BaseCard> = AbilityContext<S> & { ability: CardAction };

type TriggerEvent<W> = GameEvent<Extract<EventName, keyof W>>;

export type TriggerContext<S extends BaseCard, W> = TriggeredAbilityContext<S> & { event: TriggerEvent<W> };

/** A province's trigger may resolve without its event: Countryside Trader ignores triggering conditions. */
export type ProvinceTriggerContext<S extends BaseCard, W> = AbilityContext<S> & Pick<TriggeredAbilityContext<S>, 'cancel'> & { event?: TriggerEvent<W> };

interface TargetSpec {
    readonly bag: 'targets' | 'rings';
    readonly name: string;
    readonly holds: (value: unknown) => boolean;
}

interface BaseTargetEntry {
    activePromptTitle?: string;
    dependsOn?: string;
}

/** A card target in the shape the engine's ability props expect. */
interface CardTargetEntry extends BaseTargetEntry {
    cardType?: CardType | CardType[];
    location?: Location | Location[];
    controller?: Players | ((context: AbilityContext) => Players);
    player?: Players.Self | Players.Opponent | ((context: AbilityContext) => Players.Self | Players.Opponent);
    optional?: boolean;
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    gameAction?: GameAction | GameAction[];
}

interface RingTargetEntry extends BaseTargetEntry {
    mode: TargetMode.Ring;
    ringCondition: (ring: Ring, context?: AbilityContext) => boolean;
    gameAction?: GameAction | GameAction[];
}

interface SelectTargetEntry extends BaseTargetEntry {
    mode: TargetMode.Select;
    player?: Players.Self | Players.Opponent | ((context: AbilityContext) => Players.Self | Players.Opponent);
    choices: Record<string, GameAction>;
}

/** Everything a builder chain has declared so far. Registered by the card once `setupCardAbilities` returns. */
export interface AbilityDraft {
    readonly title: string;
    readonly holdsBase: (context: AbilityContext) => boolean;
    readonly targets: Record<string, CardTargetEntry | RingTargetEntry | SelectTargetEntry>;
    readonly specs: TargetSpec[];
    readonly costs: Cost[];
    gameActions: GameAction[];
    handler?: (context: AbilityContext) => void;
    condition?: (context: AbilityContext) => boolean;
    effect?: string;
    effectArgs?: (context: AbilityContext) => EffectArg;
    limit?: AbilityLimit;
    max?: AbilityLimit;
    location?: Location | Location[];
    cannotBeMirrored?: boolean;
    cannotTargetFirst?: boolean;
    then?: (context: AbilityContext) => object | undefined;
    initiateDuel?: (context: AbilityContext) => InitiateDuel;
    phase?: Phases | 'any';
    evenDuringDynasty?: boolean;
    conflictProvinceCondition?: (province: ProvinceCard, context: AbilityContext) => boolean;
    canTriggerOutsideConflict?: boolean;
}

export function createDraft(title: string, holdsBase: (context: AbilityContext) => boolean): AbilityDraft {
    return { title, holdsBase, targets: {}, specs: [], costs: [], gameActions: [] };
}

interface CardTargetProps<Context, EarlierContext, K, D, O> {
    cardType?: K;
    location?: Location | Location[];
    controller?: Players | ((context: EarlierContext) => Players);
    player?: Players.Self | Players.Opponent | ((context: EarlierContext) => Players.Self | Players.Opponent);
    activePromptTitle?: string;
    optional?: O;
    dependsOn?: D;
    cardCondition?: (card: CardOfType<K>, context: Context) => boolean;
}

interface RingTargetProps<Context, D> {
    activePromptTitle?: string;
    dependsOn?: D;
    ringCondition: (ring: Ring, context: Context) => boolean;
}

interface SelectTargetProps<Context, D> {
    activePromptTitle?: string;
    dependsOn?: D;
    player?: Players.Self | Players.Opponent | ((context: Context) => Players.Self | Players.Opponent);
}

/** Checks that a value is a card of the declared type: in `cardType`, and of the matching class. */
function holdsCardOf<K extends CardType | readonly CardType[] | undefined>(cardType: K | undefined): (value: unknown) => value is CardOfType<K> {
    const types = cardType === undefined ? undefined : ([] as readonly CardType[]).concat(cardType);
    return (value: unknown): value is CardOfType<K> => {
        if(!(value instanceof BaseCard)) {
            return false;
        }
        if(types === undefined) {
            return true;
        }
        if(!types.includes(value.type)) {
            return false;
        }
        return value.type === CardType.Province ? value.isProvinceCard() : value.isDrawCard();
    };
}

const holdsRing = (value: unknown): value is Ring => value instanceof Ring;

/** A typed view over an `AbilityDraft`: each call records into the draft and returns the next view. */
export class AbilityBuilder<Base extends AbilityContext, TG extends object = object, RG extends object = object, CO extends object = object> {
    constructor(protected readonly draft: AbilityDraft) {}

    /**
     * The runtime check behind `BuilderContext`: the ability's own context, with the required targets
     * set and the optional ones either unset or of their declared type.
     */
    #isContext<V extends BuilderContext<Base, object, object, CO>>(context: AbilityContext, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): context is V {
        const value = (spec: TargetSpec) => (spec.bag === 'targets' ? context.targets[spec.name] : context.rings[spec.name]);
        const mirrored = (spec: TargetSpec) =>
            spec.name !== 'target' || (spec.bag === 'targets' ? context.target : context.ring) === value(spec);
        return this.draft.holdsBase(context) &&
            required.every((spec) => spec.holds(value(spec)) && mirrored(spec)) &&
            optional.every((spec) => value(spec) === undefined || spec.holds(value(spec)));
    }

    #checked<V extends BuilderContext<Base, object, object, CO>, R>(fn: (context: V) => R, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): (context: AbilityContext) => R {
        return (context) => {
            if(!this.#isContext<V>(context, required, optional)) {
                throw new Error(`${this.draft.title}: context does not match its declared targets`);
            }
            return fn(context);
        };
    }

    /** The earlier targets a new target's callbacks see: its `dependsOn` required, the rest optional. */
    #visibleSpecs(dependsOn: string | undefined, own: TargetSpec): [TargetSpec[], TargetSpec[]] {
        const required = this.draft.specs.filter((spec) => spec.name === dependsOn).concat(own);
        const optional = this.draft.specs.filter((spec) => spec.name !== dependsOn);
        return [required, optional];
    }

    target<
        const Name extends string,
        const K extends CardType | readonly CardType[] | undefined = undefined,
        D extends keyof TG & string = never,
        const O extends boolean = false
    >(
        name: Name,
        props: CardTargetProps<
            BuilderContext<Base, Visible<TG, D, Name, CardOfType<K>>, Partial<RG>, CO>,
            BuilderContext<Base, Earlier<TG, D>, Partial<RG>, CO>,
            K,
            D,
            O
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<TG, D, Name, ChosenCard<K, O>>, Partial<RG>, CO>>[]
    ): AbilityBuilder<Base, TG & { [P in Name]: ChosenCard<K, O> }, RG, CO> {
        const holdsCard = holdsCardOf<K>(props.cardType);
        const skipped = (value: unknown) => props.optional === true && Array.isArray(value) && value.length === 0;
        // Its own callbacks see the candidate card; later ones see what was chosen.
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => holdsCard(value) || skipped(value) };
        const [required, optional] = this.#visibleSpecs(props.dependsOn, candidate);
        const { cardCondition, cardType } = props;
        const entry: CardTargetEntry = {};
        for(const key of ['location', 'activePromptTitle', 'optional', 'dependsOn'] as const) {
            if(props[key] !== undefined) {
                Object.assign(entry, { [key]: props[key] });
            }
        }
        const earlier = this.draft.specs.filter((spec) => spec.name === props.dependsOn);
        const others = this.draft.specs.filter((spec) => spec.name !== props.dependsOn);
        const { controller, player } = props;
        if(typeof controller === 'function') {
            entry.controller = this.#checked(controller, earlier, others);
        } else if(controller !== undefined) {
            entry.controller = controller;
        }
        if(typeof player === 'function') {
            entry.player = this.#checked(player, earlier, others);
        } else if(player !== undefined) {
            entry.player = player;
        }
        if(cardType !== undefined) {
            entry.cardType = ([] as CardType[]).concat(cardType);
        }
        if(cardCondition) {
            entry.cardCondition = (engineCard, context) => {
                const card: unknown = engineCard;
                if(!holdsCard(card)) {
                    return false;
                }
                if(!this.#isContext<BuilderContext<Base, Visible<TG, D, Name, CardOfType<K>>, Partial<RG>, CO>>(context, required, optional)) {
                    throw new Error(`${this.draft.title}: context does not match its declared targets`);
                }
                return cardCondition(card, context);
            };
        }
        if(gameActions.length > 0) {
            const actions = gameActions.map((action) => toGameAction(this.draft.title, action));
            entry.gameAction = actions.length === 1 ? actions[0] : actions;
        }
        this.draft.targets[name] = entry;
        this.draft.specs.push(own);
        return new AbilityBuilder(this.draft);
    }

    /**
     * A ring target. Its `ringCondition` gets the candidate as an argument: the engine's ring prompt
     * calls it with the ability's context, where the target's own ring is not set yet. It may depend on
     * a card target as well as on a ring target.
     */
    ringTarget<const Name extends string, D extends (keyof TG | keyof RG) & string = never>(
        name: Name,
        props: RingTargetProps<BuilderContext<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO>, D>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<TG, D & keyof TG>, Visible<RG, D & keyof RG, Name, Ring>, CO>>[]
    ): AbilityBuilder<Base, TG, RG & { [P in Name]: Ring }, CO> {
        const own: TargetSpec = { bag: 'rings', name, holds: holdsRing };
        const required = this.draft.specs.filter((spec) => spec.name === props.dependsOn);
        const optional = this.draft.specs.filter((spec) => spec.name !== props.dependsOn).concat(own);
        const entry: RingTargetEntry = {
            mode: TargetMode.Ring,
            ringCondition: (ring, context) => {
                if(!context || !this.#isContext<BuilderContext<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO>>(context, required, optional)) {
                    throw new Error(`${this.draft.title}: context does not match its declared targets`);
                }
                return props.ringCondition(ring, context);
            }
        };
        if(props.activePromptTitle !== undefined) {
            entry.activePromptTitle = props.activePromptTitle;
        }
        if(props.dependsOn !== undefined) {
            entry.dependsOn = props.dependsOn;
        }
        if(gameActions.length > 0) {
            const actions = gameActions.map((action) => toGameAction(this.draft.title, action));
            entry.gameAction = actions.length === 1 ? actions[0] : actions;
        }
        this.draft.targets[name] = entry;
        this.draft.specs.push(own);
        return new AbilityBuilder(this.draft);
    }

    /** A choice between named options. The choice itself lands in `context.selects`, not in `targets`. */
    select<const Name extends string, D extends keyof TG & string = never>(
        name: Name,
        props: SelectTargetProps<BuilderContext<Base, Earlier<TG, D>, Partial<RG>, CO>, D>,
        choices: NoInfer<Record<string, BuilderAction<Base, Earlier<TG, D>, Partial<RG>, CO>>>
    ): this {
        const [required, optional] = [
            this.draft.specs.filter((spec) => spec.name === props.dependsOn),
            this.draft.specs.filter((spec) => spec.name !== props.dependsOn)
        ];
        const entry: SelectTargetEntry = { mode: TargetMode.Select, choices: {} };
        for(const [label, choice] of Object.entries(choices)) {
            entry.choices[label] = toGameAction(this.draft.title, choice);
        }
        if(props.activePromptTitle !== undefined) {
            entry.activePromptTitle = props.activePromptTitle;
        }
        if(props.dependsOn !== undefined) {
            entry.dependsOn = props.dependsOn;
        }
        const player = props.player;
        if(typeof player === 'function') {
            entry.player = this.#checked(player, required, optional);
        } else if(player !== undefined) {
            entry.player = player;
        }
        this.draft.targets[name] = entry;
        return this;
    }

    cost<R extends object>(cost: Cost<R>): AbilityBuilder<Base, TG, RG, CO & R> {
        this.draft.costs.push(cost);
        return new AbilityBuilder(this.draft);
    }

    condition(condition: (context: Base) => boolean): this {
        this.draft.condition = this.#checked(condition, []);
        return this;
    }

    gameAction(...actions: BuilderAction<Base, TG, RG, CO>[]): this {
        this.draft.gameActions = this.draft.gameActions.concat(actions.map((action) => toGameAction(this.draft.title, action)));
        return this;
    }

    handler(fn: (context: BuilderContext<Base, TG, RG, CO>) => void): this {
        this.draft.handler = this.#checked(fn, this.draft.specs);
        return this;
    }

    effect(message: string, args?: (context: BuilderContext<Base, TG, RG, CO>) => EffectArg): this {
        this.draft.effect = message;
        this.draft.effectArgs = args && this.#checked(args, this.draft.specs);
        return this;
    }

    /**
     * What happens after this ability resolves; the engine's `then` properties, built from this ability's context.
     * The engine calls it as the ability resolves, so some cards return nothing and use it for a side effect.
     */
    then(fn: (context: BuilderContext<Base, TG, RG, CO>) => object | undefined): this {
        this.draft.then = this.#checked(fn, this.draft.specs);
        return this;
    }

    initiateDuel(fn: (context: BuilderContext<Base, TG, RG, CO>) => InitiateDuel): this {
        this.draft.initiateDuel = this.#checked(fn, this.draft.specs);
        return this;
    }

    phase(phase: Phases | 'any'): this {
        this.draft.phase = phase;
        return this;
    }

    evenDuringDynasty(): this {
        this.draft.evenDuringDynasty = true;
        return this;
    }

    canTriggerOutsideConflict(): this {
        this.draft.canTriggerOutsideConflict = true;
        return this;
    }

    conflictProvinceCondition(condition: (province: ProvinceCard, context: Base) => boolean): this {
        const checked = this.#checked((context: Base) => context, []);
        this.draft.conflictProvinceCondition = (province, context) => condition(province, checked(context));
        return this;
    }

    limit(limit: AbilityLimit): this {
        this.draft.limit = limit;
        return this;
    }

    max(max: AbilityLimit): this {
        this.draft.max = max;
        return this;
    }

    location(location: Location | Location[]): this {
        this.draft.location = location;
        return this;
    }

    cannotBeMirrored(): this {
        this.draft.cannotBeMirrored = true;
        return this;
    }

    cannotTargetFirst(): this {
        this.draft.cannotTargetFirst = true;
        return this;
    }
}

/** A triggered ability before its trigger is known: `when` fixes the event type of its context. */
type TriggerBase<S extends BaseCard, W, EventOptional extends boolean> =
    EventOptional extends true ? ProvinceTriggerContext<S, W> : TriggerContext<S, W>;

export class TriggerBuilder<S extends BaseCard, EventOptional extends boolean = false> {
    constructor(private readonly start: <W extends WhenType<S>>(when: W) => AbilityDraft) {}

    when<W extends WhenType<S>>(when: W): AbilityBuilder<TriggerBase<S, W, EventOptional>> {
        return new AbilityBuilder<TriggerBase<S, W, EventOptional>>(this.start(when));
    }
}

/** `holdsBase` for a triggered ability: its context carries one of the trigger's events. */
/** Checks the trigger's event; `eventOptional` is asked at check time, once the card is fully constructed. */
export function holdsTriggerEvent(when: object, eventOptional: () => boolean): (context: AbilityContext) => boolean {
    const events: string[] = Object.keys(when);
    return (context) => {
        const event = 'event' in context ? context.event : undefined;
        if(event === undefined) {
            return eventOptional();
        }
        return event instanceof Object && 'name' in event && typeof event.name === 'string' && events.includes(event.name);
    };
}

/**
 * A lone target named `target` goes in `target`, like the object form: some engine code (the
 * `toHand` restriction) only reads that one.
 */
function targetProperties(targets: AbilityDraft['targets']) {
    const names = Object.keys(targets);
    if(names.length === 1 && names[0] === 'target') {
        return { target: targets.target };
    }
    return names.length > 0 ? { targets } : {};
}

function commonProperties(draft: AbilityDraft) {
    return {
        ...targetProperties(draft.targets),
        ...(draft.costs.length > 0 ? { cost: draft.costs } : {}),
        ...(draft.gameActions.length > 0 ? { gameAction: draft.gameActions } : {}),
        ...(draft.handler ? { handler: draft.handler } : {}),
        ...(draft.effect !== undefined ? { effect: draft.effect } : {}),
        ...(draft.effectArgs ? { effectArgs: draft.effectArgs } : {}),
        ...(draft.limit ? { limit: draft.limit } : {}),
        ...(draft.max ? { max: draft.max } : {}),
        ...(draft.location ? { location: draft.location } : {}),
        ...(draft.cannotBeMirrored ? { cannotBeMirrored: true } : {}),
        ...(draft.cannotTargetFirst ? { cannotTargetFirst: true } : {}),
        ...(draft.then ? { then: draft.then } : {}),
        ...(draft.initiateDuel ? { initiateDuel: draft.initiateDuel } : {}),
        ...(draft.evenDuringDynasty ? { evenDuringDynasty: true } : {})
    };
}

/** The engine's action props for a finished draft. */
export function actionProperties<S extends BaseCard>(draft: AbilityDraft): ActionProps<S> {
    return {
        title: draft.title,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.phase ? { phase: draft.phase } : {}),
        ...(draft.conflictProvinceCondition ? { conflictProvinceCondition: draft.conflictProvinceCondition } : {}),
        ...(draft.canTriggerOutsideConflict ? { canTriggerOutsideConflict: true } : {})
    };
}

/** The engine's triggered-ability props for a finished draft. */
export function triggeredProperties<S extends BaseCard>(draft: AbilityDraft, when: WhenType<S>): TriggeredAbilityWhenProps<S> {
    return { title: draft.title, when, ...commonProperties(draft) };
}
