import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import BaseCard from './BaseCard.js';
import { CardAbility } from './CardAbility.js';
import { type EventName, type Location, type Phase, Players, TargetMode } from './Constants.js';
import type { Cost } from './costs/Cost.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import * as GameActions from './GameActions/GameActions.js';
import type { SelectCardProperties } from './GameActions/SelectCardAction.js';
import type { CancellingContext } from './GameActions/CancelAction.js';
import type { GameEvent } from './Events/EventPayloads.js';
import type { GameAction } from './GameActions/GameAction.js';
import { toGameAction, type DeclaredGameAction } from './BaseAbility.js';
import type {
    ActionCardTarget,
    ActionProps,
    ActionRingTarget,
    EffectArg,
    InitiateDuel,
    SubTarget,
    TargetAbility,
    TargetCardExactlyUpTo,
    TargetCardExactlyUpToVariable,
    TargetCardMaxStat,
    TargetCardSingleUnlimited,
    TargetElementSymbol,
    TargetRing,
    TargetSelect,
    TargetToken,
    TriggeredAbilityAggregateWhenProps,
    TriggeredAbilityWhenProps,
    WhenType
} from './Interfaces.js';
import { Event } from './Events/Event.js';
import type { MessageArgs } from './GameChat.js';
import type { ProvinceCard } from './ProvinceCard.js';
import Ring from './Ring.js';
import { ElementSymbol } from './ElementSymbol.js';
import { StatusToken } from './StatusToken.js';
import type { ThenAbilityProperties } from './ThenAbility.js';
import type { SelectChoice } from './AbilityTargets/SelectChoice.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import { isCardOfType, isCardTypeList, type CardOfType, type CardTypes } from './types/CardOfType.js';

/** A skipped optional target holds `[]`, or nothing if its prompt was hidden (`hideIfNoLegalTargets`). */
type ChosenCard<K, O> = true extends O ? CardOfType<K> | [] | undefined : CardOfType<K>;

/** A skipped optional token target holds nothing. */
type ChosenTokens<O> = true extends O ? StatusToken[] | undefined : StatusToken[];

/** Cost results are only known once paid, so they are optional. */
type BuilderContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens = object> =
    Base & { targets: Targets; rings: Rings; costs: Partial<Costs>; tokens: Tokens } & NamedTarget<Targets> & NamedRing<Rings> & NamedToken<Tokens>;

/**
 * The engine mirrors one card chosen for a target named `target` onto `context.target`, and likewise
 * for rings and tokens. A list of cards is not mirrored, so where the value may be a list (a skipped
 * optional target, or a multi-card target's own actions) `context.target` may be unset.
 */
type NamedTarget<Targets> = Targets extends { target: infer T }
    ? IsCardList<T> extends true ? unknown : { target: SingleCard<T> }
    : unknown;
/** Brackets stop the union from being split: true only if every possible value is a list. */
type IsCardList<T> = [T] extends [readonly unknown[]] ? true : false;
type SingleCard<T> = Exclude<T, readonly unknown[]> | (T extends readonly unknown[] ? undefined : never);
type NamedRing<Rings> = Rings extends { target: infer R } ? { ring: R } : unknown;
type NamedToken<Tokens> = Tokens extends { target: infer T } ? { token: T } : unknown;

/**
 * One method only: TypeScript infers `actions.x((context) => ...)` from it exactly, and since methods
 * compare bivariantly, an action built for a wider context fits too.
 */
type BuilderAction<Base extends AbilityContext, Targets, Rings, Costs, Tokens = object> = DeclaredGameAction<BuilderContext<Base, Targets, Rings, Costs, Tokens>>;

/** Copies the listed properties that are set. */
function copyDefined<P extends object>(to: object, from: P, keys: readonly (keyof P)[]): void {
    for(const key of keys) {
        if(from[key] !== undefined) {
            Object.assign(to, { [key]: from[key] });
        }
    }
}

/** The target it depends on is set; other earlier ones may not be, as the engine checks independent targets alone. */
type Visible<Bag, D extends keyof Bag, Name extends string, V> = Pick<Bag, D> & Partial<Omit<Bag, D>> & { [P in Name]: V };
type Earlier<Bag, D extends keyof Bag> = Pick<Bag, D> & Partial<Omit<Bag, D>>;

type Dependency<Targets, Rings, Tokens, SelectNames> = ((keyof Targets | keyof Rings | keyof Tokens) & string) | SelectNames;
type EarlierContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens, D> =
    BuilderContext<Base, Earlier<Targets, D & keyof Targets>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>;
type CandidateContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens, D, Name extends string, V> =
    BuilderContext<Base, Visible<Targets, D & keyof Targets, Name, V>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>;

export type ActionContext<S extends BaseCard> = AbilityContext<S> & { ability: CardAction };

/** A step's context: a new one for the same card, holding the earlier steps' targets. */
type StepContext<Base extends AbilityContext> = Base extends AbilityContext<infer S> ? AbilityContext<S> : AbilityContext;

type TriggerEvent<W> = GameEvent<Extract<EventName, keyof W>>;

export type TriggerContext<S extends BaseCard, W> = TriggeredAbilityContext<S> & { event: TriggerEvent<W> };

/** Countryside Trader resolves province triggers without their event. */
type ProvinceTriggerContext<S extends BaseCard, W> = AbilityContext<S> & Pick<TriggeredAbilityContext<S>, 'cancel'> & { event?: TriggerEvent<W> };

interface TargetSpec {
    readonly bag: 'targets' | 'rings' | 'tokens' | 'targetAbility' | 'element';
    readonly name: string;
    readonly holds: (value: unknown) => boolean;
}

type CardChoiceEntry = Omit<TargetCardSingleUnlimited, 'mode'> & SubTarget;
type SingleCardEntry = TargetCardSingleUnlimited & ActionCardTarget & SubTarget;
type MultiCardEntry = (TargetCardExactlyUpTo | TargetCardExactlyUpToVariable | TargetCardMaxStat | TargetCardSingleUnlimited) & ActionCardTarget & SubTarget;
type TokenEntry = TargetToken & SubTarget;
type ElementEntry = TargetElementSymbol & SubTarget;
type AbilityEntry = TargetAbility & SubTarget;
type RingEntry = TargetRing & ActionRingTarget & SubTarget;
type SelectEntry = TargetSelect & SubTarget;
type TargetEntry = SingleCardEntry | MultiCardEntry | TokenEntry | AbilityEntry | ElementEntry | RingEntry | SelectEntry;

/** The properties a game action factory takes, or a function of the builder's context returning them. */
type FactoryProperties<K extends keyof typeof GameActions, Context> =
    (typeof GameActions)[K] extends (factory: infer F) => unknown
        ? Exclude<NonNullable<F>, (...args: never[]) => unknown> | ((context: Context) => Exclude<NonNullable<F>, (...args: never[]) => unknown>)
        : never;

interface AbilityDraft {
    readonly title: string;
    readonly holdsBase: (context: AbilityContext) => boolean;
    readonly targets: Record<string, TargetEntry>;
    readonly specs: TargetSpec[];
    readonly costs: Cost[];
    gameActions: GameAction[];
    handler?: (context: AbilityContext) => void;
    condition?: (context: AbilityContext) => boolean;
    effect?: string | ((context: AbilityContext) => MessageArgs);
    effectArgs?: (context: AbilityContext) => EffectArg;
    limit?: AbilityLimit;
    max?: AbilityLimit;
    location?: Location | Location[];
    cannotBeMirrored?: boolean;
    cannotTargetFirst?: boolean;
    then?: (context: AbilityContext) => ThenAbilityProperties | undefined;
    /** From `onResolve()`: runs when the ability starts resolving its effects. */
    onResolve?: (context: AbilityContext) => void;
    /** The next step, from `then()`, `thenIf()`, `afterwards()` or `afterwardsIf()`. */
    thenStep?: AbilityDraft;
    /** A step's own condition, from `thenIf()` or `afterwardsIf()`, read with the context of the step before. */
    thenCondition?: (context: AbilityContext) => boolean;
    /** From `afterwards()`/`afterwardsIf()`: the step follows whether or not the step before resolved in full. */
    afterwards?: boolean;
    message?: (context: AbilityContext) => MessageArgs | undefined;
    isStep?: boolean;
    /** From `onAffinity()`: the game actions resolve only with this affinity. */
    affinity?: string;
    /** From `onAffinity()`: a Yes/No question before using the affinity, and what the chat says it does. */
    affinityOptions?: AffinityOptions;
    /** From `if()` / `otherwise()`: the game actions from `from` on are the branches, on `target` when they follow a card target without game actions. */
    branch?: { condition: (context: AbilityContext) => boolean; from: number; otherwiseFrom?: number; target?: string };
    /** The names of the card targets, in order. */
    cardTargets?: string[];
    initiateDuel?: (context: AbilityContext) => InitiateDuel;
    phase?: Phase | 'any';
    evenDuringDynasty?: boolean;
    conflictProvinceCondition?: (province: ProvinceCard, context: AbilityContext) => boolean;
    canTriggerOutsideConflict?: boolean;
    notPrinted?: boolean;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
}

/** Settings of the ability itself: a then step can't have them. */
const ABILITY_ONLY = ['condition', 'limit', 'max', 'location', 'cannotBeMirrored', 'cannotTargetFirst', 'initiateDuel', 'phase', 'evenDuringDynasty',
    'conflictProvinceCondition', 'canTriggerOutsideConflict', 'notPrinted', 'anyPlayer', 'collectiveTrigger'] as const;

/** What only an action's context has; a trigger's or a step's `ability` isn't a `CardAction`. */
type ActionOnly = { ability: CardAction };

export function createDraft(title: string, holdsBase: (context: AbilityContext) => boolean): AbilityDraft {
    return { title, holdsBase, targets: {}, specs: [], costs: [], gameActions: [] };
}

/** A target's name in `context.targets` (or `context.selects`); 'target' is also `context.target` and `{0}` in the effect message. */
type Named<Name extends string> = { name?: Name };

/** A select's choice: a game action, or a condition for a choice without game actions. */
type SelectChoiceValue<Base extends AbilityContext, Targets, Rings, Costs, Tokens, D> =
    | BuilderAction<Base, Earlier<Targets, D & keyof Targets>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>
    | ((context: EarlierContext<Base, Targets, Rings, Costs, Tokens, D>) => boolean);

/** The label chosen in a select: `context.selects[name].choice`, and `context.select` for the select named 'target'. */
type Selected<Name extends string, L extends string> =
    { selects: { [P in Name]: SelectChoice<L> } } & ('target' extends Name ? { select: L } : unknown);

/** A target given no name is named 'target'. */
type TargetName<Name> = [Name] extends [never] ? 'target' : Name;

interface CardChoiceProps<EarlierContext, K, D> {
    cardType?: K;
    location?: Location | Location[];
    controller?: Players | ((context: EarlierContext) => Players);
    player?: Players.Self | Players.Opponent | ((context: EarlierContext) => Players.Self | Players.Opponent);
    activePromptTitle?: string;
    dependsOn?: D;
    hideIfNoLegalTargets?: boolean;
}

interface CardTargetProps<Context, EarlierContext, K, D, O> extends CardChoiceProps<EarlierContext, K, D> {
    optional?: O;
    cardCondition?: (card: CardOfType<K>, context: Context) => boolean;
}

type CardsModeProps<EarlierContext, K> =
    | { mode: TargetMode.Exactly | TargetMode.UpTo; numCards: number; sameDiscardPile?: boolean }
    | { mode: TargetMode.ExactlyVariable | TargetMode.UpToVariable; numCardsFunc: (context: EarlierContext) => number }
    | { mode: TargetMode.MaxStat; numCards: number; cardStat: (card: CardOfType<K>) => number; maxStat: () => number }
    | { mode: TargetMode.Unlimited };

type CardsTargetProps<Context, EarlierContext, K, D> = CardChoiceProps<EarlierContext, K, D> & CardsModeProps<EarlierContext, K> & {
    optional?: boolean;
    cardCondition?: (card: CardOfType<K>, context: Context) => boolean;
};

interface TokenTargetProps<EarlierContext, K, D, O> extends CardChoiceProps<EarlierContext, K, D> {
    optional?: O;
    tokenCondition?: (token: StatusToken, context: EarlierContext) => boolean;
    cardCondition?: (card: CardOfType<K>, context: EarlierContext) => boolean;
}

interface AbilityTargetProps<Context, EarlierContext, K, D> extends CardChoiceProps<EarlierContext, K, D> {
    abilityCondition?: (ability: CardAbility) => boolean;
    cardCondition?: (card: CardOfType<K>, context: Context) => boolean;
}

interface RingTargetProps<Context, D, O> {
    activePromptTitle?: string;
    dependsOn?: D;
    player?: Players.Self | Players.Opponent;
    optional?: O;
    hideIfNoLegalTargets?: boolean;
    ringCondition: (ring: Ring, context: Context) => boolean;
}

interface SelectTargetProps<Context, D> {
    activePromptTitle?: string;
    dependsOn?: D;
    player?: Players.Self | Players.Opponent | ((context: Context) => Players.Self | Players.Opponent);
    targets?: boolean;
    condition?: (context: Context) => boolean;
}

function holdsCardOf<K extends CardTypes>(cardType: K | undefined): (value: unknown) => value is CardOfType<K> {
    const isCard = isCardOfType(cardType);
    return (value: unknown): value is CardOfType<K> => value instanceof BaseCard && isCard(value);
}

const holdsRing = (value: unknown): value is Ring => value instanceof Ring;
const holdsTokens = (value: unknown): value is StatusToken[] =>
    Array.isArray(value) && value.every((token) => token instanceof StatusToken);
const holdsAbility = (value: unknown): value is CardAbility => value instanceof CardAbility;
const holdsElement = (value: unknown): value is ElementSymbol => value instanceof ElementSymbol;

/** Each call records into the shared draft. Calls that declare something (a target, a cost, a step) return a builder typed with it; the others return this one. */
export class AbilityBuilder<
    Base extends AbilityContext,
    Targets extends object = object,
    Rings extends object = object,
    Costs extends object = object,
    Tokens extends object = object,
    SelectNames extends string = never
> {
    constructor(protected readonly draft: AbilityDraft) {}

    /** Sets a setting of the ability or step: once, and an ability's own only before then(). */
    #once<K extends keyof AbilityDraft>(key: K, value: AbilityDraft[K], call: string): void {
        if(this.draft[key] !== undefined) {
            throw new Error(`${this.draft.title}: ${call} is already set`);
        }
        if(this.draft.isStep && ABILITY_ONLY.some((name) => name === key)) {
            throw new Error(`${this.draft.title}: ${call} belongs to the ability, before then()`);
        }
        this.draft[key] = value;
    }

    #toAction(action: object): GameAction {
        return toGameAction(action, `${this.draft.title}: not a game action`);
    }

    #withGameActions(entry: { gameAction?: GameAction | GameAction[] }, actions: object[]): void {
        if(actions.length > 0) {
            const gameActions = actions.map((action) => this.#toAction(action));
            entry.gameAction = gameActions.length === 1 ? gameActions[0] : gameActions;
        }
    }

    #contextError(): Error {
        return new Error(`${this.draft.title}: context does not match its declared targets`);
    }

    /** The runtime check behind `BuilderContext`. */
    #isContext<V extends BuilderContext<Base, object, object, Costs>>(context: AbilityContext, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): context is V {
        const value = (spec: TargetSpec) => {
            switch(spec.bag) {
                case 'targets':
                    return context.targets[spec.name];
                case 'rings':
                    return context.rings[spec.name];
                case 'tokens':
                    return context.tokens[spec.name];
                case 'targetAbility':
                    return context.targetAbility;
                case 'element':
                    return context.element;
            }
        };
        const mirror = (spec: TargetSpec) => {
            switch(spec.bag) {
                case 'targets':
                    return context.target;
                case 'rings':
                    return context.ring;
                case 'tokens':
                    return context.token;
                case 'targetAbility':
                case 'element':
                    return value(spec);
            }
        };
        // several cards, or a skipped optional target, are not mirrored onto `context.target`
        const mirrored = (spec: TargetSpec) => spec.name !== 'target' || (spec.bag === 'targets' && Array.isArray(value(spec))) || mirror(spec) === value(spec);
        return this.draft.holdsBase(context) &&
            required.every((spec) => spec.holds(value(spec)) && mirrored(spec)) &&
            optional.every((spec) => value(spec) === undefined || spec.holds(value(spec)));
    }

    #checked<V extends BuilderContext<Base, object, object, Costs>, R>(fn: (context: V) => R, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): (context: AbilityContext) => R {
        return (context) => {
            if(!this.#isContext<V>(context, required, optional)) {
                throw this.#contextError();
            }
            return fn(context);
        };
    }

    /** Earlier targets: the one named in `dependsOn` is required, the others optional. */
    #earlier(dependsOn: string | undefined): [TargetSpec[], TargetSpec[]] {
        return [
            this.draft.specs.filter((spec) => spec.name === dependsOn),
            this.draft.specs.filter((spec) => spec.name !== dependsOn)
        ];
    }

    #cardChoice<K extends CardTypes>(props: CardChoiceProps<never, K, string>): CardChoiceEntry {
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry: CardChoiceEntry = {};
        copyDefined(entry, props, ['location', 'activePromptTitle', 'dependsOn', 'hideIfNoLegalTargets']);
        const { controller, player, cardType } = props;
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
            // a single type stays a single value: the ability target compares it with ===
            entry.cardType = isCardTypeList(cardType) ? [...cardType] : cardType;
        }
        return entry;
    }

    #cardCondition<Card, C extends BuilderContext<Base, object, object, Costs>>(
        holdsCard: (value: unknown) => value is Card,
        condition: (card: Card, context: C) => boolean,
        required: readonly TargetSpec[],
        optional: readonly TargetSpec[]
    ): (card: DrawCard, context: AbilityContext) => boolean {
        return (engineCard, context) => {
            const card: unknown = engineCard;
            if(!holdsCard(card)) {
                return false;
            }
            if(!this.#isContext<C>(context, required, optional)) {
                throw this.#contextError();
            }
            return condition(card, context);
        };
    }

    target<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<Targets, Rings, Tokens, SelectNames> = never,
        const O extends boolean = false
    >(
        props: Named<Name> & CardTargetProps<
            CandidateContext<Base, Targets, Rings, Costs, Tokens, D, TargetName<NoInfer<Name>>, CardOfType<K>>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, D>,
            K,
            D,
            O
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<Targets, D & keyof Targets, TargetName<Name>, ChosenCard<K, O>>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets & { [P in TargetName<Name>]: ChosenCard<K, O> }, Rings, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const skipped = (value: unknown) => props.optional === true && (value === undefined || (Array.isArray(value) && value.length === 0));
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => holdsCard(value) || skipped(value) };
        const entry: SingleCardEntry = this.#cardChoice(props);
        this.#addCardTarget(name, entry, props, holdsCard, candidate, own, gameActions);
        return new AbilityBuilder(this.draft);
    }

    /** Several cards at once, by `mode`. Its callbacks see one candidate at a time; later ones, every card chosen. */
    targetCards<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<Targets, Rings, Tokens, SelectNames> = never
    >(
        props: Named<Name> & CardsTargetProps<
            CandidateContext<Base, Targets, Rings, Costs, Tokens, D, TargetName<NoInfer<Name>>, CardOfType<K>>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<Targets, D & keyof Targets, TargetName<Name>, CardOfType<K> | CardOfType<K>[]>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets & { [P in TargetName<Name>]: CardOfType<K>[] }, Rings, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => Array.isArray(value) && value.every(holdsCard) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry = this.#multiCardEntry(this.#cardChoice(props), props, holdsCard, earlier, others);
        this.#addCardTarget(name, entry, props, holdsCard, candidate, own, gameActions);
        return new AbilityBuilder(this.draft);
    }

    /** What `target()` and `targetCards()` share: its callbacks see the candidate card, later ones what was chosen. */
    #addCardTarget<Card, C extends BuilderContext<Base, object, object, Costs>>(
        name: string,
        entry: SingleCardEntry | MultiCardEntry,
        props: { dependsOn?: string; optional?: boolean; cardCondition?: (card: Card, context: C) => boolean },
        holdsCard: (value: unknown) => value is Card,
        candidate: TargetSpec,
        own: TargetSpec,
        gameActions: object[]
    ): void {
        const [earlier, others] = this.#earlier(props.dependsOn);
        if(props.optional !== undefined) {
            entry.optional = props.optional;
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, [...earlier, candidate], others);
        }
        this.#withGameActions(entry, gameActions);
        this.#addTarget(name, entry, own);
        this.draft.cardTargets = [...(this.draft.cardTargets ?? []), name];
    }

    #multiCardEntry<K extends CardTypes, EarlierContext extends BuilderContext<Base, object, object, Costs>>(
        choice: CardChoiceEntry,
        props: CardsModeProps<EarlierContext, K>,
        holdsCard: (value: unknown) => value is CardOfType<K>,
        earlier: readonly TargetSpec[],
        others: readonly TargetSpec[]
    ): MultiCardEntry {
        switch(props.mode) {
            case TargetMode.Exactly:
            case TargetMode.UpTo:
                return { ...choice, mode: props.mode, numCards: props.numCards, ...(props.sameDiscardPile !== undefined ? { sameDiscardPile: props.sameDiscardPile } : {}) };
            case TargetMode.ExactlyVariable:
            case TargetMode.UpToVariable:
                return { ...choice, mode: props.mode, numCardsFunc: this.#checked(props.numCardsFunc, earlier, others) };
            case TargetMode.MaxStat: {
                const { cardStat } = props;
                return {
                    ...choice,
                    mode: props.mode,
                    numCards: props.numCards,
                    maxStat: props.maxStat,
                    cardStat: (card) => {
                        if(!holdsCard(card)) {
                            throw new Error(`${this.draft.title}: ${card.name} is not a card this target can hold`);
                        }
                        return cardStat(card);
                    }
                };
            }
            case TargetMode.Unlimited:
                return { ...choice, mode: props.mode };
        }
    }

    /** The status tokens on a chosen card. Its own conditions run before it is set. */
    tokenTarget<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<Targets, Rings, Tokens, SelectNames> = never,
        const O extends boolean = false
    >(
        props: Named<Name> & TokenTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, D>, K, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<Targets, D & keyof Targets>, Earlier<Rings, D & keyof Rings>, Costs, Visible<Tokens, D & keyof Tokens, TargetName<Name>, StatusToken[]>>>[]
    ): AbilityBuilder<Base, Targets, Rings, Costs, Tokens & { [P in TargetName<Name>]: ChosenTokens<O> }, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const own: TargetSpec = { bag: 'tokens', name, holds: (value) => holdsTokens(value) || (props.optional === true && value === undefined) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry: TokenEntry = { ...this.#cardChoice(props), mode: TargetMode.Token };
        if(props.optional !== undefined) {
            entry.optional = props.optional;
        }
        const { tokenCondition } = props;
        if(tokenCondition) {
            const checked = this.#checked((context: EarlierContext<Base, Targets, Rings, Costs, Tokens, D>) => context, earlier, others);
            entry.tokenCondition = (token, context) => tokenCondition(token, checked(context));
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, earlier, others);
        }
        this.#withGameActions(entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** A triggered ability printed on a chosen card; it is always `context.targetAbility`, so this target takes no name. */
    abilityTarget<
        const K extends CardTypes = undefined,
        D extends Dependency<Targets, Rings, Tokens, SelectNames> = never
    >(
        props: AbilityTargetProps<
            EarlierContext<Base & { targetAbility: CardAbility }, Targets, Rings, Costs, Tokens, D>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base & { targetAbility: CardAbility }, Earlier<Targets, D & keyof Targets>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>>[]
    ): AbilityBuilder<Base & { targetAbility: CardAbility }, Targets, Rings, Costs, Tokens, SelectNames> {
        const name = 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const own: TargetSpec = { bag: 'targetAbility', name: 'targetAbility', holds: holdsAbility };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry: AbilityEntry = { ...this.#cardChoice(props), mode: TargetMode.Ability };
        if(props.abilityCondition) {
            entry.abilityCondition = props.abilityCondition;
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, [...earlier, own], others);
        }
        this.#withGameActions(entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** An element symbol printed on a chosen card, in `context.element`; the card is `context.elementCard`. */
    elementTarget<const K extends CardTypes = undefined>(
        props: Pick<CardChoiceProps<never, K, never>, 'cardType' | 'location' | 'activePromptTitle'>,
        ...gameActions: NoInfer<BuilderAction<Base & { element: ElementSymbol; elementCard: BaseCard }, Targets, Rings, Costs, Tokens>>[]
    ): AbilityBuilder<Base & { element: ElementSymbol; elementCard: BaseCard }, Targets, Rings, Costs, Tokens, SelectNames> {
        const own: TargetSpec = { bag: 'element', name: 'target', holds: holdsElement };
        const entry: ElementEntry = { ...this.#cardChoice(props), mode: TargetMode.ElementSymbol };
        this.#withGameActions(entry, gameActions);
        this.#addTarget('target', entry, own);
        return new AbilityBuilder(this.draft);
    }

    #addTarget(name: string, entry: TargetEntry, own?: TargetSpec): void {
        if(this.draft.branch) {
            throw new Error(`${this.draft.title}: targets come before if()`);
        }
        if(name in this.draft.targets) {
            throw new Error(`${this.draft.title}: two targets named ${name}`);
        }
        this.draft.targets[name] = entry;
        if(own) {
            this.draft.specs.push(own);
        }
    }

    /** `ringCondition` gets the candidate as an argument: the engine's ring prompt doesn't set it on the context. */
    ringTarget<const Name extends string = never, D extends Dependency<Targets, Rings, Tokens, SelectNames> = never, const O extends boolean = false>(
        props: Named<Name> & RingTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, D>, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<Targets, D & keyof Targets>, Visible<Rings, D & keyof Rings, TargetName<Name>, Ring>, Costs, Earlier<Tokens, D & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets, Rings & { [P in TargetName<Name>]: true extends O ? Ring | undefined : Ring }, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const own: TargetSpec = { bag: 'rings', name, holds: (value) => holdsRing(value) || (props.optional === true && value === undefined) };
        const [required, others] = this.#earlier(props.dependsOn);
        const optional = others.concat(own);
        const entry: RingEntry = {
            mode: TargetMode.Ring,
            ringCondition: (ring, context) => {
                if(!this.#isContext<EarlierContext<Base, Targets, Rings, Costs, Tokens, D>>(context, required, optional)) {
                    throw this.#contextError();
                }
                return props.ringCondition(ring, context);
            }
        };
        copyDefined(entry, props, ['activePromptTitle', 'dependsOn', 'player', 'optional', 'hideIfNoLegalTargets']);
        this.#withGameActions(entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** The choice lands in `context.selects`, not in `targets`. A choice is a game action, or a condition (no game action) offered while it holds. */
    select<const Name extends string = never, D extends Dependency<Targets, Rings, Tokens, SelectNames> = never, const L extends string = string>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, D>, D>,
        choices: Record<L, NoInfer<SelectChoiceValue<Base, Targets, Rings, Costs, Tokens, D>>>
    ): AbilityBuilder<Base & Selected<TargetName<Name>, L>, Targets, Rings, Costs, Tokens, SelectNames | TargetName<Name>> {
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const entries: Record<string, GameAction | ((context: AbilityContext) => boolean)> = {};
        for(const [label, choice] of Object.entries<SelectChoiceValue<Base, Targets, Rings, Costs, Tokens, D>>(choices)) {
            // a condition is a choice without game actions ("No"), available while it holds
            entries[label] = typeof choice === 'function' ? this.#checked(choice, required, optional) : this.#toAction(choice);
        }
        this.#select(name, props, entries);
        return new AbilityBuilder(this.draft);
    }

    /** Choices that depend on the context, such as a label naming an earlier target. */
    selectFrom<const Name extends string = never, D extends Dependency<Targets, Rings, Tokens, SelectNames> = never>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, D>, D>,
        choices: (context: EarlierContext<Base, Targets, Rings, Costs, Tokens, D>) => Record<string, BuilderAction<Base, Earlier<Targets, D & keyof Targets>, Earlier<Rings, D & keyof Rings>, Costs, Earlier<Tokens, D & keyof Tokens>>>
    ): AbilityBuilder<Base, Targets, Rings, Costs, Tokens, SelectNames | TargetName<Name>> {
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const checked = this.#checked(choices, required, optional);
        this.#select(name, props, (context: AbilityContext) => this.#actionChoices(checked(context)));
        return new AbilityBuilder(this.draft);
    }

    #actionChoices(choices: Record<string, object>): Record<string, GameAction> {
        const actions: Record<string, GameAction> = {};
        for(const [label, choice] of Object.entries(choices)) {
            actions[label] = this.#toAction(choice);
        }
        return actions;
    }

    #select<Context extends BuilderContext<Base, object, object, Costs>>(name: string, props: SelectTargetProps<Context, string>, choices: SelectEntry['choices']): void {
        const [required, optional] = this.#earlier(props.dependsOn);
        const entry: SelectEntry = { mode: TargetMode.Select, choices };
        copyDefined(entry, props, ['activePromptTitle', 'dependsOn', 'targets']);
        const { player, condition } = props;
        if(typeof player === 'function') {
            entry.player = this.#checked(player, required, optional);
        } else if(player !== undefined) {
            entry.player = player;
        }
        if(condition) {
            entry.condition = this.#checked(condition, required, optional);
        }
        this.#addTarget(name, entry);
    }

    cost<R extends object>(cost: Cost<R, Base>): AbilityBuilder<Base, Targets, Rings, Costs & R, Tokens, SelectNames> {
        this.draft.costs.push(cost);
        return new AbilityBuilder(this.draft);
    }

    condition(condition: (context: Base) => boolean): this {
        this.#once('condition', this.#checked(condition, []), 'condition()');
        return this;
    }

    /**
     * "With [trait] affinity" (usually an element, but any trait, e.g. Shadow): this step's game actions resolve only if the player has that affinity.
     * `prompt` asks the player first ("Pay 1 fate to swap abilities?"); `effect` is what the chat says the affinity does.
     */
    onAffinity(trait: string, options: AffinityOptions<BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        this.#once('affinity', trait, 'onAffinity()');
        this.draft.affinityOptions = {
            ...(options.prompt !== undefined ? { prompt: options.prompt } : {}),
            ...(options.effect ? { effect: this.#checked(options.effect, this.draft.specs) } : {})
        };
        return this;
    }

    /**
     * "If …": the game actions after it resolve only when `condition` holds, the ones after otherwise() (if any) when it doesn't.
     * Right after a card target without game actions, they are that target's: they resolve on the chosen card
     * (after several such targets, they stay on the ability).
     */
    if(condition: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => boolean): this {
        if(this.draft.branch) {
            throw new Error(`${this.draft.title}: one if() per step`);
        }
        const target = this.#branchTarget();
        if(target === undefined) {
            this.draft.branch = { condition: this.#checked(condition, this.draft.specs), from: this.draft.gameActions.length };
            return this;
        }
        // read for each candidate, before the other targets are chosen; without a card yet, otherwise() stands
        const [required, optional] = this.#earlier(target);
        this.draft.branch = {
            condition: (context) => this.#isContext<BuilderContext<Base, Targets, Rings, Costs, Tokens>>(context, required, optional) && condition(context),
            from: this.draft.gameActions.length,
            target
        };
        return this;
    }

    /**
     * The card target the branches belong to: the last target, when it is the only card target without game actions.
     * With several, none is meant more than another, so the branches stay on the ability.
     */
    #branchTarget(): string | undefined {
        const bare = (this.draft.cardTargets ?? []).filter((name) => {
            const entry = this.draft.targets[name];
            return !('gameAction' in entry) || entry.gameAction === undefined;
        });
        const names = Object.keys(this.draft.targets);
        return bare.length === 1 && bare[0] === names[names.length - 1] ? bare[0] : undefined;
    }

    /** "Otherwise, …": the game actions after it resolve when the if() condition doesn't hold. */
    otherwise(): this {
        if(!this.draft.branch || this.draft.branch.otherwiseFrom !== undefined) {
            throw new Error(`${this.draft.title}: otherwise() follows an if()`);
        }
        this.draft.branch.otherwiseFrom = this.draft.gameActions.length;
        return this;
    }

    /** The player of the ability gains honor; `amount` defaults to 1. */
    gainHonor(amount?: number): this;
    /** With the factory's properties (another target, a computed amount), or a function of the context returning them. */
    gainHonor(properties: FactoryProperties<'gainHonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this;
    gainHonor(properties: number | FactoryProperties<'gainHonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = 1): this {
        return this.gameAction(GameActions.gainHonor(amountProperties(properties)));
    }

    /** The player of the ability loses honor; `amount` defaults to 1. */
    loseHonor(amount?: number): this;
    /** With the factory's properties (another target, a computed amount), or a function of the context returning them. */
    loseHonor(properties: FactoryProperties<'loseHonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this;
    loseHonor(properties: number | FactoryProperties<'loseHonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = 1): this {
        return this.gameAction(GameActions.loseHonor(amountProperties(properties)));
    }

    /** The player of the ability gains fate; `amount` defaults to 1. */
    gainFate(amount?: number): this;
    /** With the factory's properties (another target, a computed amount), or a function of the context returning them. */
    gainFate(properties: FactoryProperties<'gainFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this;
    gainFate(properties: number | FactoryProperties<'gainFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = 1): this {
        return this.gameAction(GameActions.gainFate(amountProperties(properties)));
    }

    /** The player of the ability loses fate; `amount` defaults to 1. */
    loseFate(amount?: number): this;
    /** With the factory's properties (another target, a computed amount), or a function of the context returning them. */
    loseFate(properties: FactoryProperties<'loseFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this;
    loseFate(properties: number | FactoryProperties<'loseFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = 1): this {
        return this.gameAction(GameActions.loseFate(amountProperties(properties)));
    }

    /** The player of the ability draws cards; `amount` defaults to 1. */
    draw(amount?: number): this;
    /** With the factory's properties (another target, a computed amount), or a function of the context returning them. */
    draw(properties: FactoryProperties<'draw', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this;
    draw(properties: number | FactoryProperties<'draw', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = 1): this {
        return this.gameAction(GameActions.draw(amountProperties(properties)));
    }

    /** Readies the target (the source by default). */
    ready(properties: FactoryProperties<'ready', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.ready(properties));
    }

    /** Bows the target (the source by default). */
    bow(properties: FactoryProperties<'bow', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.bow(properties));
    }

    /** Honors the target (the source by default). */
    honor(properties: FactoryProperties<'honor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.honor(properties));
    }

    /** Dishonors the target (the source by default). */
    dishonor(properties: FactoryProperties<'dishonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.dishonor(properties));
    }

    /** Places fate on the target (the source by default). */
    placeFate(properties: FactoryProperties<'placeFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.placeFate(properties));
    }

    /** Removes fate from the target (the source by default). */
    removeFate(properties: FactoryProperties<'removeFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.removeFate(properties));
    }

    /** Sends the target home (the source by default). */
    sendHome(properties: FactoryProperties<'sendHome', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.sendHome(properties));
    }

    /** Moves the target to the conflict (the source by default). */
    moveToConflict(properties: FactoryProperties<'moveToConflict', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.moveToConflict(properties));
    }

    /** Discards the target from play (the source by default). */
    discardFromPlay(properties: FactoryProperties<'discardFromPlay', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.discardFromPlay(properties));
    }

    /** Sacrifices the target (the source by default). */
    sacrifice(properties: FactoryProperties<'sacrifice', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.sacrifice(properties));
    }

    /** Takes honor from the target (the opponent by default). */
    takeHonor(properties: FactoryProperties<'takeHonor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.takeHonor(properties));
    }

    /** Takes fate from the target (the opponent by default). */
    takeFate(properties: FactoryProperties<'takeFate', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.takeFate(properties));
    }

    /** Refills a province faceup. */
    refillFaceup(properties: FactoryProperties<'refillFaceup', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.refillFaceup(properties));
    }

    /** A lasting effect on cards (the source by default). */
    cardLastingEffect(properties: FactoryProperties<'cardLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.cardLastingEffect(properties));
    }

    /** A lasting effect on players. */
    playerLastingEffect(properties: FactoryProperties<'playerLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.playerLastingEffect(properties));
    }

    /** The player (or `player`) chooses a card when the ability resolves, and `gameAction` resolves on it. */
    selectCard<const K extends CardTypes = CardTypes>(
        properties: SelectCardProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, K> | ((context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => SelectCardProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, K>)
    ): this {
        return this.gameAction(GameActions.selectCard<BuilderContext<Base, Targets, Rings, Costs, Tokens>, K>(properties));
    }

    /** Searches a deck: look at its top cards, choose some, and resolve `gameAction` on them. */
    deckSearch(properties: FactoryProperties<'deckSearch', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.deckSearch(properties));
    }

    /** Cancels the triggering event (interrupts only), optionally replacing it with `replacementGameAction`. */
    cancel<B extends Base & CancellingContext>(
        this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>,
        properties: FactoryProperties<'cancel', BuilderContext<B, Targets, Rings, Costs, Tokens>> = {}
    ): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        return this.gameAction(GameActions.cancel(properties));
    }

    gameAction(...actions: BuilderAction<Base, Targets, Rings, Costs, Tokens>[]): this {
        this.draft.gameActions = this.draft.gameActions.concat(actions.map((action) => this.#toAction(action)));
        return this;
    }

    handler(fn: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => void): this {
        this.#once('handler', this.#checked(fn, this.draft.specs), 'handler()');
        return this;
    }

    /** A format whose `{0}` is the target, with its later arguments; or a `msg` template. */
    effect(message: string, args?: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => EffectArg): this;
    effect(message: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs): this;
    effect(
        message: string | ((context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs),
        args?: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => EffectArg
    ): this {
        if(this.draft.isStep) {
            throw new Error(`${this.draft.title}: a then step prints its message with message()`);
        }
        this.#once('effect', typeof message === 'string' ? message : this.#checked(message, this.draft.specs), 'effect()');
        this.draft.effectArgs = args && this.#checked(args, this.draft.specs);
        return this;
    }

    /**
     * "Then, …": the next step, declared with the same methods. It resolves when this step's events
     * resolved in full, and its context holds the targets chosen so far.
     */
    then(): AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames> {
        return new AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames>(this.#step());
    }

    /**
     * A next step read after this one, without "then" on the card ("… now at home"): it follows
     * whether or not this step resolved in full.
     */
    afterwards(): AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames> {
        const step = this.#step();
        step.afterwards = true;
        return new AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames>(step);
    }

    /**
     * "If …", read after this step, without "then" on the card ("If it is now in a province …"):
     * the next step follows when `condition` holds, whether or not this step resolved in full.
     */
    afterwardsIf(condition: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => boolean): AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames> {
        const step = this.#step();
        step.afterwards = true;
        step.thenCondition = this.#checked(condition, this.draft.specs);
        return new AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames>(step);
    }

    /**
     * "Then, you may [pay] to resolve this ability again": once it resolved, the player may pay `cost` (`label` names it on the button)
     * to resolve it once more; on that second resolution they may pay it again, for no effect. Without a cost, a Yes/No question.
     */
    mayResolveAgain(options: {
        cost?: BuilderAction<Base, Targets, Rings, Costs, Tokens>;
        label?: string;
        condition?: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => boolean;
    } = {}): this {
        const cost = options.cost && this.#toAction(options.cost);
        const label = options.label;
        if(cost && !label) {
            throw new Error(`${this.draft.title}: mayResolveAgain() with a cost needs a label`);
        }
        const condition = options.condition && this.#checked(options.condition, this.draft.specs);
        return this.#resolveAgain((context) => {
            if(condition && !condition(context)) {
                return undefined;
            }
            if(!cost || !label) {
                return context.subResolution ? undefined : resolveAgainPrompt(context, 'Resolve this ability again?', Players.Self);
            }
            const verb = label.charAt(0).toLowerCase() + label.slice(1);
            if(context.subResolution) {
                return {
                    inheritTargets: true,
                    target: { mode: TargetMode.Select, choices: { [`${label} for no effect`]: cost, Done: () => true } },
                    message: '{0} chooses {3}to {4} for no effect',
                    messageArgs: (choiceContext: AbilityContext) => [choiceContext.select === 'Done' ? 'not ' : '', verb]
                };
            }
            return {
                inheritTargets: true,
                target: { mode: TargetMode.Select, choices: { [`${label} to resolve this ability again`]: cost, Done: () => true } },
                message: '{0} chooses {3}to {4} to resolve {1} again',
                messageArgs: (choiceContext: AbilityContext) => [choiceContext.select === 'Done' ? 'not ' : '', verb],
                // paid even when changed on the way (Embrace the Void takes the fate), but not when cancelled or declined
                then: {
                    thenCondition: (contextOrEvent: AbilityContext | Event) => contextOrEvent instanceof Event && !contextOrEvent.cancelled,
                    gameAction: resolveAgain(context)
                }
            };
        });
    }

    /** "Then, your opponent may resolve this ability": they are asked, and resolve it as if it were theirs (so they may hand it back). */
    opponentMayResolveAgain(activePromptTitle: string): this {
        return this.#resolveAgain((context) => resolveAgainPrompt(context, activePromptTitle, Players.Opponent));
    }

    #resolveAgain(then: (context: AbilityContext) => ThenAbilityProperties | undefined): this {
        if(this.draft.then || this.draft.thenStep) {
            throw new Error(`${this.draft.title}: a step has one next step`);
        }
        this.draft.then = then;
        return this;
    }

    /** Runs `fn` when the ability starts resolving its effects, for bookkeeping such as counting uses. */
    onResolve(fn: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => void): this {
        this.#once('onResolve', this.#checked(fn, this.draft.specs), 'onResolve()');
        return this;
    }

    /** "Then, if …": the next step, when this step resolved in full and `condition` holds. */
    thenIf(condition: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => boolean): AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames> {
        const step = this.#step();
        step.thenCondition = this.#checked(condition, this.draft.specs);
        return new AbilityBuilder<StepContext<Base>, Targets, Rings, Costs, Tokens, SelectNames>(step);
    }

    #step(): AbilityDraft {
        if(this.draft.then || this.draft.thenStep) {
            throw new Error(`${this.draft.title}: a step has one next step`);
        }
        const step: AbilityDraft = { ...createDraft(this.draft.title, () => true), specs: [...this.draft.specs], isStep: true };
        this.draft.thenStep = step;
        return step;
    }

    /** A then step's message, as a `msg` template; nothing is printed when it returns `undefined`. */
    message(fn: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs | undefined): this {
        if(!this.draft.isStep) {
            throw new Error(`${this.draft.title}: the ability's own message is its effect()`);
        }
        this.#once('message', this.#checked(fn, this.draft.specs), 'message()');
        return this;
    }

    /** The duel is the ability's effect and chooses its own targets, so the ability has no target() (checked at setup). */
    initiateDuel(fn: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => InitiateDuel): this {
        this.#once('initiateDuel', this.#checked(fn, this.draft.specs), 'initiateDuel()');
        return this;
    }

    /** Actions only: the phase the action can be used in. */
    phase<B extends Base & ActionOnly>(this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>, phase: Phase | 'any'): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('phase', phase, 'phase()');
        return this;
    }

    /** Actions only: usable in the Dynasty phase without the per-type restrictions. */
    evenDuringDynasty<B extends Base & ActionOnly>(this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('evenDuringDynasty', true, 'evenDuringDynasty()');
        return this;
    }

    /** Province actions only: usable when no conflict is at a province. */
    canTriggerOutsideConflict<B extends Base & ActionOnly & { source: ProvinceCard }>(this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('canTriggerOutsideConflict', true, 'canTriggerOutsideConflict()');
        return this;
    }

    /** Province actions only: which conflict provinces allow the action (by default this one). */
    conflictProvinceCondition<B extends Base & ActionOnly & { source: ProvinceCard }>(
        this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>,
        condition: (province: ProvinceCard, context: B) => boolean
    ): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        const checked = this.#checked((context: B) => context, []);
        this.#once('conflictProvinceCondition', (province, context) => condition(province, checked(context)), 'conflictProvinceCondition()');
        return this;
    }

    limit(limit: AbilityLimit): this {
        this.#once('limit', limit, 'limit()');
        return this;
    }

    max(max: AbilityLimit): this {
        this.#once('max', max, 'max()');
        return this;
    }

    location(location: Location | Location[]): this {
        this.#once('location', location, 'location()');
        return this;
    }

    cannotBeMirrored(): this {
        this.#once('cannotBeMirrored', true, 'cannotBeMirrored()');
        return this;
    }

    cannotTargetFirst(): this {
        this.#once('cannotTargetFirst', true, 'cannotTargetFirst()');
        return this;
    }

    /** Not printed on the card, so effects that copy or count printed abilities skip it. */
    notPrinted(): this {
        this.#once('notPrinted', true, 'notPrinted()');
        return this;
    }

    /** Any player may trigger it, not only the card's controller (not with aggregateWhen; checked at setup). */
    anyPlayer(): this {
        this.#once('anyPlayer', true, 'anyPlayer()');
        return this;
    }

    /** Triggers only: triggers once for events that happen together. */
    collectiveTrigger<B extends Base & CancellingContext>(this: AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<B, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('collectiveTrigger', true, 'collectiveTrigger()');
        return this;
    }
}

type TriggerBase<S extends BaseCard, W, EventOptional extends boolean> =
    EventOptional extends true ? ProvinceTriggerContext<S, W> : TriggerContext<S, W>;

type AggregateBase<S extends BaseCard, EventOptional extends boolean> = EventOptional extends true
    ? AbilityContext<S> & Pick<TriggeredAbilityContext<S>, 'cancel'> & { event?: Event[] }
    : TriggeredAbilityContext<S> & { event: Event[] };

type AggregateWhen<S extends BaseCard> = (events: Event[], context: TriggeredAbilityContext<S, BaseCard, Event[]>) => boolean;

interface TriggerStarts<S extends BaseCard> {
    when<W extends WhenType<S>>(when: W): AbilityDraft;
    aggregateWhen(aggregateWhen: AggregateWhen<S>): AbilityDraft;
}

export class TriggerBuilder<S extends BaseCard, EventOptional extends boolean = false> {
    constructor(private readonly starts: TriggerStarts<S>) {}

    when<W extends WhenType<S>>(when: W): AbilityBuilder<TriggerBase<S, W, EventOptional>> {
        return new AbilityBuilder<TriggerBase<S, W, EventOptional>>(this.starts.when(when));
    }

    /** Triggers on a window's events together, e.g. on the total fate they moved. */
    aggregateWhen(aggregateWhen: AggregateWhen<S>): AbilityBuilder<AggregateBase<S, EventOptional>> {
        return new AbilityBuilder<AggregateBase<S, EventOptional>>(this.starts.aggregateWhen(aggregateWhen));
    }
}

export function holdsAggregateEvents(eventOptional: () => boolean): (context: AbilityContext) => boolean {
    return (context) => {
        const events = 'event' in context ? context.event : undefined;
        return events === undefined ? eventOptional() : Array.isArray(events);
    };
}

/** `eventOptional` is read at check time: during `setupCardAbilities` the card's own fields aren't set yet. */
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

/** A lone `target` goes in `target`, like the object form: the `toHand` restriction only reads that. */
function targetProperties(targets: AbilityDraft['targets']) {
    const names = Object.keys(targets);
    if(names.length === 1 && names[0] === 'target') {
        return { target: targets.target };
    }
    return names.length > 0 ? { targets } : {};
}

/** A handler replaces the step's resolution, so what it would skip is a mistake. Target actions only decide what can be chosen. */
function checkHandler(draft: AbilityDraft): void {
    if(!draft.handler) {
        return;
    }
    const skipped = [
        draft.gameActions.length > 0 && (draft.branch ? 'if()' : 'game actions'),
        draft.affinity && 'onAffinity()',
        (draft.thenStep || draft.then) && 'a following step or resolving again'
    ].filter(Boolean);
    if(skipped.length > 0) {
        throw new Error(`${draft.title}: handler() replaces the step's resolution, so ${skipped.join(', ')} would never run`);
    }
}

/** Settings that would be ignored by what they are combined with. */
function checkCombinations(draft: AbilityDraft): void {
    if(draft.affinity && draft.gameActions.length === 0) {
        throw new Error(`${draft.title}: onAffinity() covers the ability's or step's own game actions, and there are none (a target's aren't covered)`);
    }
    if(draft.initiateDuel && Object.keys(draft.targets).length > 0) {
        throw new Error(`${draft.title}: initiateDuel() chooses the duel's targets itself, so the ability has no target()`);
    }
}

function commonProperties(ability: AbilityDraft) {
    checkHandler(ability);
    const draft = withBranches(ability);
    checkCombinations(draft);
    return {
        ...targetProperties(draft.targets),
        ...(draft.costs.length > 0 ? { cost: draft.costs } : {}),
        ...gameActionProperties(draft),
        ...(draft.handler ? { handler: draft.handler } : {}),
        ...(draft.onResolve ? { onResolve: draft.onResolve } : {}),
        ...(draft.effect !== undefined ? { effect: draft.effect } : {}),
        ...(draft.effectArgs ? { effectArgs: draft.effectArgs } : {}),
        ...(draft.limit ? { limit: draft.limit } : {}),
        ...(draft.max ? { max: draft.max } : {}),
        ...(draft.location ? { location: draft.location } : {}),
        ...(draft.cannotBeMirrored ? { cannotBeMirrored: true } : {}),
        ...(draft.cannotTargetFirst ? { cannotTargetFirst: true } : {}),
        ...thenProperties(draft),
        ...(draft.initiateDuel ? { initiateDuel: draft.initiateDuel } : {}),
        ...(draft.notPrinted ? { printedAbility: false } : {})
    };
}

/** The ability of `context` once more, as a sub-resolution: it doesn't ask again, nor count toward its max. */
function resolveAgain(context: AbilityContext, player?: Player): GameAction {
    const ability = context.ability;
    if(!ability.isCardAbilityInstance()) {
        throw new Error('only a card ability resolves again');
    }
    return GameActions.resolveAbility({
        ability,
        ...(player ? { player } : {}),
        ...('event' in context && context.event instanceof Event ? { event: context.event } : {}),
        subResolution: true,
        choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
    });
}

/** "May resolve this ability again": `chooser` (the opponent resolves it as theirs, or the player in a solo game) answers Yes or No; No is offered only when Yes can resolve. */
function resolveAgainPrompt(context: AbilityContext, activePromptTitle: string, chooser: Players.Self | Players.Opponent): ThenAbilityProperties {
    const opponent = chooser === Players.Opponent ? context.player.opponent : undefined;
    const again = resolveAgain(context, opponent);
    const player = opponent ?? context.player;
    return {
        inheritTargets: true,
        target: {
            ...(opponent ? { player: Players.Opponent } : {}),
            mode: TargetMode.Select,
            activePromptTitle,
            choices: {
                Yes: again,
                No: (choiceContext: AbilityContext) => again.hasLegalTarget(choiceContext)
            }
        },
        message: opponent ? '{3} chooses {4}to resolve {1}\'s ability again' : '{0} chooses {3}to resolve {1} again',
        messageArgs: (choiceContext: AbilityContext) => opponent
            ? [player, choiceContext.select === 'No' ? 'not ' : '']
            : [choiceContext.select === 'No' ? 'not ' : '']
    };
}

/** A number is the action's `amount`. */
const amountProperties = <P>(properties: number | P): P | { amount: number } => typeof properties === 'number' ? { amount: properties } : properties;

const oneAction = (actions: GameAction[]) => actions.length === 1 ? actions[0] : GameActions.multiple(actions);

/** The draft with its if() branches in one conditional action: on the ability, or on the card target they follow. */
function withBranches(draft: AbilityDraft): AbilityDraft {
    const branch = draft.branch;
    if(!branch) {
        return draft;
    }
    const actions = draft.gameActions;
    const yes = actions.slice(branch.from, branch.otherwiseFrom);
    const no = branch.otherwiseFrom === undefined ? [GameActions.noAction()] : actions.slice(branch.otherwiseFrom);
    if(yes.length === 0 || no.length === 0) {
        throw new Error(`${draft.title}: if() and otherwise() each need a game action`);
    }
    const condition = branch.condition;
    const branches = GameActions.conditional({ condition: (context) => condition(context), trueGameAction: oneAction(yes), falseGameAction: oneAction(no) });
    const before = actions.slice(0, branch.from);
    if(branch.target === undefined) {
        return { ...draft, branch: undefined, gameActions: [...before, branches] };
    }
    return { ...draft, branch: undefined, gameActions: before, targets: { ...draft.targets, [branch.target]: { ...draft.targets[branch.target], gameAction: branches } } };
}

interface AffinityOptions<Context = AbilityContext> {
    prompt?: string;
    effect?: (context: Context) => MessageArgs;
}

/** The game actions, inside one affinity action when the ability or step has `onAffinity()`. */
function gameActionProperties(draft: AbilityDraft): { gameAction?: GameAction[] } {
    const actions = draft.gameActions;
    if(actions.length === 0) {
        return {};
    }
    if(!draft.affinity) {
        return { gameAction: actions };
    }
    const trait = draft.affinity;
    const gameAction = oneAction(actions);
    const { prompt, effect } = draft.affinityOptions ?? {};
    return { gameAction: [GameActions.onAffinity((context) => {
        const [format, args] = effect ? effect(context) : [undefined, undefined];
        return {
            trait,
            gameAction,
            ...(prompt !== undefined ? { prompt } : {}),
            ...(format !== undefined ? { effect: format, effectArgs: args } : {})
        };
    })] };
}

/** The next step. */
function thenProperties(draft: AbilityDraft): { then?: ThenAbilityProperties | ((context: AbilityContext) => ThenAbilityProperties | undefined) } {
    const next = draft.thenStep ? stepProperties(draft.thenStep) : draft.then;
    return next ? { then: next } : {};
}

/** A step from `then()`, `thenIf()`, `afterwards()` or `afterwardsIf()`, built once. */
function stepProperties(draft: AbilityDraft): ThenAbilityProperties {
    checkHandler(draft);
    const step = withBranches(draft);
    checkCombinations(step);
    if(step.effect !== undefined) {
        throw new Error(`${step.title}: a then step prints its message with message()`);
    }
    const abilityOnly = ABILITY_ONLY.filter((key) => step[key] !== undefined);
    if(abilityOnly.length > 0) {
        throw new Error(`${step.title}: ${abilityOnly.join(', ')} belong to the ability, before then()`);
    }
    return {
        inheritTargets: true,
        ...targetProperties(step.targets),
        ...(step.costs.length > 0 ? { cost: step.costs } : {}),
        ...gameActionProperties(step),
        ...(step.handler ? { handler: step.handler } : {}),
        ...(step.onResolve ? { onResolve: step.onResolve } : {}),
        ...(step.message ? { message: step.message } : {}),
        ...stepCondition(step),
        ...thenProperties(step)
    };
}

/**
 * When a step follows. `then()`: the engine's default, every event of the step before resolved in full.
 * `thenIf()`: that, and its condition. `afterwards()`/`afterwardsIf()`: only the condition, also when the step
 * before raised no events. On the event path the condition gets each event, whose context is the step before.
 */
function stepCondition(step: AbilityDraft): Pick<ThenAbilityProperties, 'thenCondition'> {
    const condition = step.thenCondition;
    if(step.afterwards) {
        return { thenCondition: (contextOrEvent: AbilityContext | Event) => {
            const context = contextOrEvent instanceof Event ? contextOrEvent.context : contextOrEvent;
            return !!context && (!condition || condition(context));
        } };
    }
    if(!condition) {
        return {};
    }
    return { thenCondition: (contextOrEvent: AbilityContext | Event) =>
        contextOrEvent instanceof Event && contextOrEvent.isFullyResolved() && !!contextOrEvent.context && condition(contextOrEvent.context) };
}

export function toActionProps<S extends BaseCard>(draft: AbilityDraft): ActionProps<S> {
    return {
        title: draft.title,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.phase ? { phase: draft.phase } : {}),
        ...(draft.evenDuringDynasty ? { evenDuringDynasty: true } : {}),
        ...(draft.conflictProvinceCondition ? { conflictProvinceCondition: draft.conflictProvinceCondition } : {}),
        ...(draft.canTriggerOutsideConflict ? { canTriggerOutsideConflict: true } : {}),
        ...(draft.anyPlayer ? { anyPlayer: true } : {})
    };
}

export function toTriggerProps<S extends BaseCard>(draft: AbilityDraft, when: WhenType<S>): TriggeredAbilityWhenProps<S> {
    return {
        title: draft.title,
        when,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.anyPlayer ? { anyPlayer: true } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}

export function toAggregateProps<S extends BaseCard>(draft: AbilityDraft, aggregateWhen: AggregateWhen<S>): TriggeredAbilityAggregateWhenProps<S> {
    if(draft.anyPlayer) {
        throw new Error(`${draft.title}: anyPlayer() doesn't work with aggregateWhen`);
    }
    return {
        title: draft.title,
        aggregateWhen,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}
