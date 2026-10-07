import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import BaseCard from './BaseCard.js';
import CardAbility from './CardAbility.js';
import { type Element, type EventName, type Location, type Phases, Players, TargetMode } from './Constants.js';
import { getAbilityDsl } from './AbilityDslProvider.js';
import type { Cost } from './costs/Cost.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import type * as GameActions from './GameActions/GameActions.js';
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
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import { isCardOfType, isCardTypeList, type CardOfType, type CardTypes } from './types/CardOfType.js';

/** A skipped optional target holds `[]`, or nothing if its prompt was hidden (`hideIfNoLegalTargets`). */
type ChosenCard<K, O> = true extends O ? CardOfType<K> | [] | undefined : CardOfType<K>;

/** A skipped optional token target holds nothing. */
type ChosenTokens<O> = true extends O ? StatusToken[] | undefined : StatusToken[];

/** Cost results are only known once paid, so they are optional. */
type BuilderContext<Base extends AbilityContext, TG, RG, CO, TK = object> =
    Base & { targets: TG; rings: RG; costs: Partial<CO>; tokens: TK } & NamedTarget<TG> & NamedRing<RG> & NamedToken<TK>;

/**
 * The engine mirrors one card chosen for a target named `target` onto `context.target`, and likewise
 * for rings and tokens. A list of cards is not mirrored, so where the value may be a list (a skipped
 * optional target, or a multi-card target's own actions) `context.target` may be unset.
 */
type NamedTarget<TG> = TG extends { target: infer T }
    ? IsCardList<T> extends true ? unknown : { target: SingleCard<T> }
    : unknown;
/** Brackets stop the union from being split: true only if every possible value is a list. */
type IsCardList<T> = [T] extends [readonly unknown[]] ? true : false;
type SingleCard<T> = Exclude<T, readonly unknown[]> | (T extends readonly unknown[] ? undefined : never);
type NamedRing<RG> = RG extends { target: infer R } ? { ring: R } : unknown;
type NamedToken<TK> = TK extends { target: infer T } ? { token: T } : unknown;

/**
 * One method only: TypeScript infers `actions.x((context) => ...)` from it exactly, and since methods
 * compare bivariantly, an action built for a wider context fits too.
 */
type BuilderAction<Base extends AbilityContext, TG, RG, CO, TK = object> = DeclaredGameAction<BuilderContext<Base, TG, RG, CO, TK>>;

function withGameActions(title: string, entry: { gameAction?: GameAction | GameAction[] }, actions: object[]): void {
    if(actions.length > 0) {
        const gameActions = actions.map((action) => toGameAction(action, `${title}: not a game action`));
        entry.gameAction = gameActions.length === 1 ? gameActions[0] : gameActions;
    }
}

/** The target it depends on is set; other earlier ones may not be, as the engine checks independent targets alone. */
type Visible<Bag, D extends keyof Bag, Name extends string, V> = Pick<Bag, D> & Partial<Omit<Bag, D>> & { [P in Name]: V };
type Earlier<Bag, D extends keyof Bag> = Pick<Bag, D> & Partial<Omit<Bag, D>>;

type Dependency<TG, RG, TK, SL> = ((keyof TG | keyof RG | keyof TK) & string) | SL;
type EarlierContext<Base extends AbilityContext, TG, RG, CO, TK, D> =
    BuilderContext<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>;
type CandidateContext<Base extends AbilityContext, TG, RG, CO, TK, D, Name extends string, V> =
    BuilderContext<Base, Visible<TG, D & keyof TG, Name, V>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>;

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
type ActionProperties<K extends keyof typeof GameActions, Context> =
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
    /** The next step, from `then()` or `thenIf()`. */
    thenStep?: AbilityDraft;
    /** A step's own condition, from `thenIf()`, read with the context of the step before. */
    thenCondition?: (context: AbilityContext) => boolean;
    message?: (context: AbilityContext) => MessageArgs | undefined;
    isStep?: boolean;
    /** From `onAffinity()`: the game actions resolve only with this affinity. */
    affinity?: Element;
    /** From `onAffinity()`: a Yes/No question before using the affinity, and what the chat says it does. */
    affinityOptions?: AffinityOptions;
    /** From `if()` / `otherwise()`: the game actions from `from` on are the branches, on `target` when they follow a card target without game actions. */
    branch?: { condition: (context: AbilityContext) => boolean; from: number; otherwiseFrom?: number; target?: string };
    /** The names of the card targets, in order. */
    cardTargets?: string[];
    initiateDuel?: (context: AbilityContext) => InitiateDuel;
    phase?: Phases | 'any';
    evenDuringDynasty?: boolean;
    conflictProvinceCondition?: (province: ProvinceCard, context: AbilityContext) => boolean;
    canTriggerOutsideConflict?: boolean;
    notPrinted?: boolean;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
}

export function createDraft(title: string, holdsBase: (context: AbilityContext) => boolean): AbilityDraft {
    return { title, holdsBase, targets: {}, specs: [], costs: [], gameActions: [] };
}

/** A target's name in `context.targets` (or `context.selects`); 'target' is also `context.target` and `{0}` in the effect message. */
type Named<Name extends string> = { name?: Name };

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

/** Each call records into the shared draft and returns a new view, typed with what it declared. */
export class AbilityBuilder<
    Base extends AbilityContext,
    TG extends object = object,
    RG extends object = object,
    CO extends object = object,
    TK extends object = object,
    SL extends string = never
> {
    constructor(protected readonly draft: AbilityDraft) {}

    /** The runtime check behind `BuilderContext`. */
    #isContext<V extends BuilderContext<Base, object, object, CO>>(context: AbilityContext, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): context is V {
        const value = (spec: TargetSpec) => {
            switch(spec.bag) {
                case 'targets':
                    return context.targets[spec.name];
                case 'rings':
                    return context.rings[spec.name];
                case 'tokens':
                    return context.tokens[spec.name];
                case 'targetAbility':
                    return context.targetAbility ?? undefined;
                case 'element':
                    return context.element ?? undefined;
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

    #checked<V extends BuilderContext<Base, object, object, CO>, R>(fn: (context: V) => R, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): (context: AbilityContext) => R {
        return (context) => {
            if(!this.#isContext<V>(context, required, optional)) {
                throw new Error(`${this.draft.title}: context does not match its declared targets`);
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
        for(const key of ['location', 'activePromptTitle', 'dependsOn', 'hideIfNoLegalTargets'] as const) {
            if(props[key] !== undefined) {
                Object.assign(entry, { [key]: props[key] });
            }
        }
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

    #cardCondition<Card, C extends BuilderContext<Base, object, object, CO>>(
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
                throw new Error(`${this.draft.title}: context does not match its declared targets`);
            }
            return condition(card, context);
        };
    }

    target<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<TG, RG, TK, SL> = never,
        const O extends boolean = false
    >(
        props: Named<Name> & CardTargetProps<
            CandidateContext<Base, TG, RG, CO, TK, D, TargetName<NoInfer<Name>>, CardOfType<K>>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D,
            O
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<TG, D & keyof TG, TargetName<Name>, ChosenCard<K, O>>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG & { [P in TargetName<Name>]: ChosenCard<K, O> }, RG, CO, TK, SL> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const skipped = (value: unknown) => props.optional === true && (value === undefined || (Array.isArray(value) && value.length === 0));
        // its own callbacks see the candidate card, later ones what was chosen
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => holdsCard(value) || skipped(value) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry: SingleCardEntry = this.#cardChoice(props);
        if(props.optional !== undefined) {
            entry.optional = props.optional;
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, [...earlier, candidate], others);
        }
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget(name, entry, own);
        this.draft.cardTargets = [...(this.draft.cardTargets ?? []), name];
        return new AbilityBuilder(this.draft);
    }

    /** Several cards at once, by `mode`. Its callbacks see one candidate at a time; later ones, every card chosen. */
    targetCards<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<TG, RG, TK, SL> = never
    >(
        props: Named<Name> & CardsTargetProps<
            CandidateContext<Base, TG, RG, CO, TK, D, TargetName<NoInfer<Name>>, CardOfType<K>>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<TG, D & keyof TG, TargetName<Name>, CardOfType<K> | CardOfType<K>[]>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG & { [P in TargetName<Name>]: CardOfType<K>[] }, RG, CO, TK, SL> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<K>(props.cardType);
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => Array.isArray(value) && value.every(holdsCard) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const choice = this.#cardChoice(props);
        const entry = this.#multiCardEntry(choice, props, holdsCard, earlier, others);
        if(props.optional !== undefined) {
            entry.optional = props.optional;
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, [...earlier, candidate], others);
        }
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget(name, entry, own);
        this.draft.cardTargets = [...(this.draft.cardTargets ?? []), name];
        return new AbilityBuilder(this.draft);
    }

    #multiCardEntry<K extends CardTypes, EarlierContext extends BuilderContext<Base, object, object, CO>>(
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
        D extends Dependency<TG, RG, TK, SL> = never,
        const O extends boolean = false
    >(
        props: Named<Name> & TokenTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, K, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Visible<TK, D & keyof TK, TargetName<Name>, StatusToken[]>>>[]
    ): AbilityBuilder<Base, TG, RG, CO, TK & { [P in TargetName<Name>]: ChosenTokens<O> }, SL> {
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
            const checked = this.#checked((context: EarlierContext<Base, TG, RG, CO, TK, D>) => context, earlier, others);
            entry.tokenCondition = (token, context) => {
                if(!context) {
                    throw new Error(`${this.draft.title}: token condition without a context`);
                }
                return tokenCondition(token, checked(context));
            };
        }
        if(props.cardCondition) {
            entry.cardCondition = this.#cardCondition(holdsCard, props.cardCondition, earlier, others);
        }
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** A triggered ability printed on a chosen card, in `context.targetAbility`. */
    abilityTarget<
        const Name extends string = never,
        const K extends CardTypes = undefined,
        D extends Dependency<TG, RG, TK, SL> = never
    >(
        props: Named<Name> & AbilityTargetProps<
            EarlierContext<Base & { targetAbility: CardAbility }, TG, RG, CO, TK, D>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base & { targetAbility: CardAbility }, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base & { targetAbility: CardAbility }, TG, RG, CO, TK, SL> {
        const name = props.name ?? 'target';
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
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** An element symbol printed on a chosen card, in `context.element`; the card is `context.elementCard`. */
    elementTarget<const K extends CardTypes = undefined>(
        props: Pick<CardChoiceProps<never, K, never>, 'cardType' | 'location' | 'activePromptTitle'>,
        ...gameActions: NoInfer<BuilderAction<Base & { element: ElementSymbol; elementCard: BaseCard }, TG, RG, CO, TK>>[]
    ): AbilityBuilder<Base & { element: ElementSymbol; elementCard: BaseCard }, TG, RG, CO, TK, SL> {
        const own: TargetSpec = { bag: 'element', name: 'target', holds: holdsElement };
        const entry: ElementEntry = { ...this.#cardChoice(props), mode: TargetMode.ElementSymbol };
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget('target', entry, own);
        return new AbilityBuilder(this.draft);
    }

    #addTarget(name: string, entry: TargetEntry, own?: TargetSpec): void {
        if(this.draft.branch) {
            throw new Error(`${this.draft.title}: targets come before if()`);
        }
        this.draft.targets[name] = entry;
        if(own) {
            this.draft.specs.push(own);
        }
    }

    /** `ringCondition` gets the candidate as an argument: the engine's ring prompt doesn't set it on the context. */
    ringTarget<const Name extends string = never, D extends Dependency<TG, RG, TK, SL> = never, const O extends boolean = false>(
        props: Named<Name> & RingTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<TG, D & keyof TG>, Visible<RG, D & keyof RG, TargetName<Name>, Ring>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG, RG & { [P in TargetName<Name>]: true extends O ? Ring | undefined : Ring }, CO, TK, SL> {
        const name = props.name ?? 'target';
        const own: TargetSpec = { bag: 'rings', name, holds: (value) => holdsRing(value) || (props.optional === true && value === undefined) };
        const [required, others] = this.#earlier(props.dependsOn);
        const optional = others.concat(own);
        const entry: RingEntry = {
            mode: TargetMode.Ring,
            ringCondition: (ring, context) => {
                if(!context || !this.#isContext<EarlierContext<Base, TG, RG, CO, TK, D>>(context, required, optional)) {
                    throw new Error(`${this.draft.title}: context does not match its declared targets`);
                }
                return props.ringCondition(ring, context);
            }
        };
        for(const key of ['activePromptTitle', 'dependsOn', 'player', 'optional', 'hideIfNoLegalTargets'] as const) {
            if(props[key] !== undefined) {
                Object.assign(entry, { [key]: props[key] });
            }
        }
        withGameActions(this.draft.title, entry, gameActions);
        this.#addTarget(name, entry, own);
        return new AbilityBuilder(this.draft);
    }

    /** The choice lands in `context.selects`, not in `targets`. */
    select<const Name extends string = never, D extends Dependency<TG, RG, TK, SL> = never>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        choices: NoInfer<Record<string,
            | BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>
            | ((context: EarlierContext<Base, TG, RG, CO, TK, D>) => boolean)>>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | TargetName<Name>> {
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const entries: Record<string, GameAction | ((context: AbilityContext) => boolean)> = {};
        for(const [label, choice] of Object.entries(choices)) {
            // a condition is a choice without game actions ("No"), available while it holds
            entries[label] = typeof choice === 'function' ? this.#checked(choice, required, optional) : toGameAction(choice, `${this.draft.title}: not a game action`);
        }
        this.#select(name, props, entries);
        return new AbilityBuilder(this.draft);
    }

    /** Choices that only need to be available; the handler reads which one was picked from `context.select`. */
    selectIf<const Name extends string = never, D extends Dependency<TG, RG, TK, SL> = never>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        conditions: Record<string, (context: EarlierContext<Base, TG, RG, CO, TK, D>) => boolean>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | TargetName<Name>> {
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const checked: Record<string, (context: AbilityContext) => boolean> = {};
        for(const [label, condition] of Object.entries(conditions)) {
            checked[label] = this.#checked(condition, required, optional);
        }
        this.#select(name, props, checked);
        return new AbilityBuilder(this.draft);
    }

    /** Choices that depend on the context, such as a label naming an earlier target. */
    selectFrom<const Name extends string = never, D extends Dependency<TG, RG, TK, SL> = never>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        choices: (context: EarlierContext<Base, TG, RG, CO, TK, D>) => Record<string, BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | TargetName<Name>> {
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const checked = this.#checked(choices, required, optional);
        this.#select(name, props, (context: AbilityContext) => this.#actionChoices(checked(context)));
        return new AbilityBuilder(this.draft);
    }

    #actionChoices(choices: Record<string, object>): Record<string, GameAction> {
        const actions: Record<string, GameAction> = {};
        for(const [label, choice] of Object.entries(choices)) {
            actions[label] = toGameAction(choice, `${this.draft.title}: not a game action`);
        }
        return actions;
    }

    #select<Context extends BuilderContext<Base, object, object, CO>>(name: string, props: SelectTargetProps<Context, string>, choices: SelectEntry['choices']): void {
        const [required, optional] = this.#earlier(props.dependsOn);
        const entry: SelectEntry = { mode: TargetMode.Select, choices };
        for(const key of ['activePromptTitle', 'dependsOn', 'targets'] as const) {
            if(props[key] !== undefined) {
                Object.assign(entry, { [key]: props[key] });
            }
        }
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

    cost<R extends object>(cost: Cost<R, Base>): AbilityBuilder<Base, TG, RG, CO & R, TK, SL> {
        this.draft.costs.push(cost);
        return new AbilityBuilder(this.draft);
    }

    condition(condition: (context: Base) => boolean): this {
        this.draft.condition = this.#checked(condition, []);
        return this;
    }

    /**
     * "With [element] affinity": this step's game actions resolve only if the player has that affinity.
     * `prompt` asks the player first ("Pay 1 fate to swap abilities?"); `effect` is what the chat says the affinity does.
     */
    onAffinity(element: Element, options: AffinityOptions<BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        this.draft.affinity = element;
        this.draft.affinityOptions = {
            ...(options.prompt !== undefined ? { prompt: options.prompt } : {}),
            ...(options.effect ? { effect: this.#checked(options.effect, this.draft.specs) } : {})
        };
        return this;
    }

    /**
     * "If …": the game actions after it resolve only when `condition` holds, the ones after otherwise() (if any) when it doesn't.
     * Right after a card target without game actions, they are that target's: they resolve on the chosen card.
     */
    if(condition: (context: BuilderContext<Base, TG, RG, CO, TK>) => boolean): this {
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
            condition: (context) => this.#isContext<BuilderContext<Base, TG, RG, CO, TK>>(context, required, optional) && condition(context),
            from: this.draft.gameActions.length,
            target
        };
        return this;
    }

    /** The card target the branches belong to: the last target, when it is a card target without game actions. */
    #branchTarget(): string | undefined {
        const bare = (this.draft.cardTargets ?? []).filter((name) => {
            const entry = this.draft.targets[name];
            return !('gameAction' in entry) || entry.gameAction === undefined;
        });
        if(bare.length > 1) {
            throw new Error(`${this.draft.title}: if() after several targets without game actions`);
        }
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

    /** The player of the ability gains honor. */
    gainHonor(amount = 1): this {
        return this.gameAction(getAbilityDsl().actions.gainHonor({ amount }));
    }

    /** The player of the ability loses honor. */
    loseHonor(amount = 1): this {
        return this.gameAction(getAbilityDsl().actions.loseHonor({ amount }));
    }

    /** The player of the ability gains fate. */
    gainFate(amount = 1): this {
        return this.gameAction(getAbilityDsl().actions.gainFate({ amount }));
    }

    /** The player of the ability draws cards. */
    draw(amount = 1): this {
        return this.gameAction(getAbilityDsl().actions.draw({ amount }));
    }

    /** Readies the target (the source by default). */
    ready(properties: ActionProperties<'ready', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.ready(properties));
    }

    /** Bows the target (the source by default). */
    bow(properties: ActionProperties<'bow', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.bow(properties));
    }

    /** Honors the target (the source by default). */
    honor(properties: ActionProperties<'honor', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.honor(properties));
    }

    /** Dishonors the target (the source by default). */
    dishonor(properties: ActionProperties<'dishonor', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.dishonor(properties));
    }

    /** Places fate on the target (the source by default). */
    placeFate(properties: ActionProperties<'placeFate', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.placeFate(properties));
    }

    /** Removes fate from the target (the source by default). */
    removeFate(properties: ActionProperties<'removeFate', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.removeFate(properties));
    }

    /** Sends the target home (the source by default). */
    sendHome(properties: ActionProperties<'sendHome', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.sendHome(properties));
    }

    /** Moves the target to the conflict (the source by default). */
    moveToConflict(properties: ActionProperties<'moveToConflict', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.moveToConflict(properties));
    }

    /** Discards the target from play (the source by default). */
    discardFromPlay(properties: ActionProperties<'discardFromPlay', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.discardFromPlay(properties));
    }

    /** Sacrifices the target (the source by default). */
    sacrifice(properties: ActionProperties<'sacrifice', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.sacrifice(properties));
    }

    /** Takes honor from the target (the opponent by default). */
    takeHonor(properties: ActionProperties<'takeHonor', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.takeHonor(properties));
    }

    /** Takes fate from the target (the opponent by default). */
    takeFate(properties: ActionProperties<'takeFate', BuilderContext<Base, TG, RG, CO, TK>> = {}): this {
        return this.gameAction(getAbilityDsl().actions.takeFate(properties));
    }

    /** Refills a province faceup. */
    refillFaceup(properties: ActionProperties<'refillFaceup', BuilderContext<Base, TG, RG, CO, TK>>): this {
        return this.gameAction(getAbilityDsl().actions.refillFaceup(properties));
    }

    /** A lasting effect on cards (the source by default). */
    cardLastingEffect(properties: ActionProperties<'cardLastingEffect', BuilderContext<Base, TG, RG, CO, TK>>): this {
        return this.gameAction(getAbilityDsl().actions.cardLastingEffect(properties));
    }

    /** A lasting effect on players. */
    playerLastingEffect(properties: ActionProperties<'playerLastingEffect', BuilderContext<Base, TG, RG, CO, TK>>): this {
        return this.gameAction(getAbilityDsl().actions.playerLastingEffect(properties));
    }

    /** The player (or `player`) chooses a card when the ability resolves, and `gameAction` resolves on it. */
    selectCard<const K extends CardTypes = CardTypes>(
        properties: SelectCardProperties<BuilderContext<Base, TG, RG, CO, TK>, K> | ((context: BuilderContext<Base, TG, RG, CO, TK>) => SelectCardProperties<BuilderContext<Base, TG, RG, CO, TK>, K>)
    ): this {
        return this.gameAction(getAbilityDsl().actions.selectCard<BuilderContext<Base, TG, RG, CO, TK>, K>(properties));
    }

    /** Searches a deck: look at its top cards, choose some, and resolve `gameAction` on them. */
    deckSearch(properties: ActionProperties<'deckSearch', BuilderContext<Base, TG, RG, CO, TK>>): this {
        return this.gameAction(getAbilityDsl().actions.deckSearch(properties));
    }

    /** Cancels the triggering event (interrupts only), optionally replacing it with `replacementGameAction`. */
    cancel<B extends Base & CancellingContext>(
        this: AbilityBuilder<B, TG, RG, CO, TK, SL>,
        properties: ActionProperties<'cancel', BuilderContext<B, TG, RG, CO, TK>> = {}
    ): AbilityBuilder<B, TG, RG, CO, TK, SL> {
        return this.gameAction(getAbilityDsl().actions.cancel(properties));
    }

    gameAction(...actions: BuilderAction<Base, TG, RG, CO, TK>[]): this {
        this.draft.gameActions = this.draft.gameActions.concat(actions.map((action) => toGameAction(action, `${this.draft.title}: not a game action`)));
        return this;
    }

    handler(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => void): this {
        this.draft.handler = this.#checked(fn, this.draft.specs);
        return this;
    }

    /** A format whose `{0}` is the target, with its later arguments; or a `msg` template. */
    effect(message: string, args?: (context: BuilderContext<Base, TG, RG, CO, TK>) => EffectArg): this;
    effect(message: (context: BuilderContext<Base, TG, RG, CO, TK>) => MessageArgs): this;
    effect(
        message: string | ((context: BuilderContext<Base, TG, RG, CO, TK>) => MessageArgs),
        args?: (context: BuilderContext<Base, TG, RG, CO, TK>) => EffectArg
    ): this {
        this.draft.effect = typeof message === 'string' ? message : this.#checked(message, this.draft.specs);
        this.draft.effectArgs = args && this.#checked(args, this.draft.specs);
        return this;
    }

    /**
     * "Then, …": the next step, declared with the same methods. It resolves when this step's events
     * resolved in full, and its context holds the targets chosen so far.
     */
    then(): AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL> {
        return new AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL>(this.#step());
    }

    /** "Then, …" even when this step didn't resolve in full: the next step follows in any case. */
    thenAlways(): AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL> {
        const step = this.#step();
        step.thenCondition = () => true;
        return new AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL>(step);
    }

    /**
     * "You may [pay] to resolve this ability twice": once it resolved, the player may pay `cost` (`label` names it on the button)
     * to resolve it again; on that second resolution they may pay it again, for no effect. Without a cost, a Yes/No question.
     */
    mayResolveTwice(options: {
        cost?: BuilderAction<Base, TG, RG, CO, TK>;
        label?: string;
        condition?: (context: BuilderContext<Base, TG, RG, CO, TK>) => boolean;
    } = {}): this {
        const cost = options.cost && toGameAction(options.cost, `${this.draft.title}: not a game action`);
        const label = options.label;
        if(cost && !label) {
            throw new Error(`${this.draft.title}: mayResolveTwice() with a cost needs a label`);
        }
        const condition = options.condition && this.#checked(options.condition, this.draft.specs);
        return this.#resolveAgain((context) => {
            if(condition && !condition(context)) {
                return undefined;
            }
            if(!cost || !label) {
                return context.subResolution ? undefined : mayResolveAgain(context, 'Resolve this ability again?', Players.Self);
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
        return this.#resolveAgain((context) => mayResolveAgain(context, activePromptTitle, Players.Opponent));
    }

    #resolveAgain(then: (context: AbilityContext) => ThenAbilityProperties | undefined): this {
        if(this.draft.then || this.draft.thenStep) {
            throw new Error(`${this.draft.title}: a step has one next step`);
        }
        this.draft.then = then;
        return this;
    }

    /** Runs `fn` when the ability starts resolving its effects, for bookkeeping such as counting uses. */
    onResolve(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => void): this {
        this.draft.onResolve = this.#checked(fn, this.draft.specs);
        return this;
    }

    /** "Then, if …": the next step, when `condition` holds once this step resolved. */
    thenIf(condition: (context: BuilderContext<Base, TG, RG, CO, TK>) => boolean): AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL> {
        const step = this.#step();
        step.thenCondition = this.#checked(condition, this.draft.specs);
        return new AbilityBuilder<StepContext<Base>, TG, RG, CO, TK, SL>(step);
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
    message(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => MessageArgs | undefined): this {
        if(!this.draft.isStep) {
            throw new Error(`${this.draft.title}: the ability's own message is its effect()`);
        }
        this.draft.message = this.#checked(fn, this.draft.specs);
        return this;
    }

    initiateDuel(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => InitiateDuel): this {
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

    /** Not printed on the card, so effects that copy or count printed abilities skip it. */
    notPrinted(): this {
        this.draft.notPrinted = true;
        return this;
    }

    /** Any player may trigger it, not only the card's controller. */
    anyPlayer(): this {
        this.draft.anyPlayer = true;
        return this;
    }

    /** Triggers once for events that happen together. */
    collectiveTrigger(): this {
        this.draft.collectiveTrigger = true;
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

export function holdsTriggerEvents(eventOptional: () => boolean): (context: AbilityContext) => boolean {
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

function commonProperties(ability: AbilityDraft) {
    const draft = withBranches(ability);
    return {
        ...targetProperties(draft.targets),
        ...(draft.costs.length > 0 ? { cost: draft.costs } : {}),
        ...gameActionProperties(draft),
        ...(draft.handler ? { handler: draft.handler } : {}),
        ...(draft.effect !== undefined ? { effect: draft.effect } : {}),
        ...(draft.effectArgs ? { effectArgs: draft.effectArgs } : {}),
        ...(draft.limit ? { limit: draft.limit } : {}),
        ...(draft.max ? { max: draft.max } : {}),
        ...(draft.location ? { location: draft.location } : {}),
        ...(draft.cannotBeMirrored ? { cannotBeMirrored: true } : {}),
        ...(draft.cannotTargetFirst ? { cannotTargetFirst: true } : {}),
        ...thenProperties(draft),
        ...(draft.initiateDuel ? { initiateDuel: draft.initiateDuel } : {}),
        ...(draft.evenDuringDynasty ? { evenDuringDynasty: true } : {}),
        ...(draft.notPrinted ? { printedAbility: false } : {})
    };
}

/** The ability of `context` once more, as a sub-resolution: it doesn't ask again, nor count toward its max. */
function resolveAgain(context: AbilityContext, player?: Player): GameAction {
    const ability = context.ability;
    if(!ability.isCardAbilityInstance()) {
        throw new Error('only a card ability resolves again');
    }
    return getAbilityDsl().actions.resolveAbility({
        ability,
        ...(player ? { player } : {}),
        ...('event' in context && context.event instanceof Event ? { event: context.event } : {}),
        subResolution: true,
        choosingPlayerOverride: context.choosingPlayerOverride ?? undefined
    });
}

/** "May resolve this ability again": `chooser` (the opponent resolves it as theirs, or the player in a solo game) answers Yes or No; No is offered only when Yes can resolve. */
function mayResolveAgain(context: AbilityContext, activePromptTitle: string, chooser: Players.Self | Players.Opponent): ThenAbilityProperties {
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

const oneAction = (actions: GameAction[]) => actions.length === 1 ? actions[0] : getAbilityDsl().actions.multiple(actions);

/** The draft with its if() branches in one conditional action: on the ability, or on the card target they follow. */
function withBranches(draft: AbilityDraft): AbilityDraft {
    const branch = draft.branch;
    if(!branch) {
        return draft;
    }
    const dsl = getAbilityDsl().actions;
    const actions = draft.gameActions;
    const yes = actions.slice(branch.from, branch.otherwiseFrom);
    const no = branch.otherwiseFrom === undefined ? [dsl.noAction()] : actions.slice(branch.otherwiseFrom);
    if(yes.length === 0 || no.length === 0) {
        throw new Error(`${draft.title}: if() and otherwise() each need a game action`);
    }
    const condition = branch.condition;
    const branches = dsl.conditional({ condition: (context) => condition(context), trueGameAction: oneAction(yes), falseGameAction: oneAction(no) });
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
    return { gameAction: [getAbilityDsl().actions.onAffinity((context) => {
        const [format, args] = effect ? effect(context) : [undefined, undefined];
        return {
            trait,
            gameAction,
            ...(prompt !== undefined ? { promptTitleForConfirmingAffinity: prompt } : {}),
            ...(format !== undefined ? { effect: format, effectArgs: args } : {})
        };
    })] };
}

/** The next step; with `onResolve()`, a callback that runs it first, when the ability starts resolving. */
function thenProperties(draft: AbilityDraft): { then?: ThenAbilityProperties | ((context: AbilityContext) => ThenAbilityProperties | undefined) } {
    const next = draft.thenStep ? stepProperties(draft.thenStep) : draft.then;
    const hook = draft.onResolve;
    if(!hook) {
        return next ? { then: next } : {};
    }
    return {
        then: (context) => {
            hook(context);
            return typeof next === 'function' ? next(context) : next;
        }
    };
}

/** A step from `then()` or `thenIf()`, built once. */
function stepProperties(draft: AbilityDraft): ThenAbilityProperties {
    const step = withBranches(draft);
    if(step.effect !== undefined) {
        throw new Error(`${step.title}: a then step prints its message with message()`);
    }
    const abilityOnly = (['condition', 'limit', 'max', 'location', 'cannotBeMirrored', 'cannotTargetFirst', 'initiateDuel', 'phase', 'evenDuringDynasty',
        'conflictProvinceCondition', 'canTriggerOutsideConflict', 'notPrinted', 'anyPlayer', 'collectiveTrigger'] as const).filter((key) => step[key] !== undefined);
    if(abilityOnly.length > 0) {
        throw new Error(`${step.title}: ${abilityOnly.join(', ')} belong to the ability, before then()`);
    }
    const condition = step.thenCondition;
    return {
        inheritTargets: true,
        ...targetProperties(step.targets),
        ...(step.costs.length > 0 ? { cost: step.costs } : {}),
        ...gameActionProperties(step),
        ...(step.handler ? { handler: step.handler } : {}),
        ...(step.message ? { message: step.message } : {}),
        // on the event path the condition gets each event, whose context is the step before
        ...(condition ? { thenCondition: (contextOrEvent: AbilityContext | Event) => {
            const context = contextOrEvent instanceof Event ? contextOrEvent.context : contextOrEvent;
            return !!context && condition(context);
        } } : {}),
        ...thenProperties(step)
    };
}

export function actionProperties<S extends BaseCard>(draft: AbilityDraft): ActionProps<S> {
    return {
        title: draft.title,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.phase ? { phase: draft.phase } : {}),
        ...(draft.conflictProvinceCondition ? { conflictProvinceCondition: draft.conflictProvinceCondition } : {}),
        ...(draft.canTriggerOutsideConflict ? { canTriggerOutsideConflict: true } : {}),
        ...(draft.anyPlayer ? { anyPlayer: true } : {})
    };
}

export function triggeredProperties<S extends BaseCard>(draft: AbilityDraft, when: WhenType<S>): TriggeredAbilityWhenProps<S> {
    return {
        title: draft.title,
        when,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.anyPlayer ? { anyPlayer: true } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}

export function aggregateProperties<S extends BaseCard>(draft: AbilityDraft, aggregateWhen: AggregateWhen<S>): TriggeredAbilityAggregateWhenProps<S> {
    return {
        title: draft.title,
        aggregateWhen,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}
