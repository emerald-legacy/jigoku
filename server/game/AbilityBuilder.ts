import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import BaseCard from './BaseCard.js';
import CardAbility from './CardAbility.js';
import { CardType, type EventName, type Location, type Phases, type Players, TargetMode } from './Constants.js';
import type { Cost } from './costs/Cost.js';
import type DrawCard from './DrawCard.js';
import type { GameEvent } from './Events/EventPayloads.js';
import { GameAction } from './GameActions/GameAction.js';
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
import type { Event } from './Events/Event.js';
import type { ProvinceCard } from './ProvinceCard.js';
import Ring from './Ring.js';
import { ElementSymbol } from './ElementSymbol.js';
import { StatusToken } from './StatusToken.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type { CardOfType } from './types/CardOfType.js';

/** A skipped optional target holds `[]`, or nothing if its prompt was hidden (`hideIfNoLegalTargets`). */
type ChosenCard<K, O> = true extends O ? CardOfType<K> | [] | undefined : CardOfType<K>;

/** A skipped optional token target holds nothing. */
type ChosenTokens<O> = true extends O ? StatusToken[] | undefined : StatusToken[];

/** Cost results are only known once paid, so they are optional. */
type BuilderContext<Base extends AbilityContext, TG, RG, CO, TK = object> =
    Base & { targets: TG; rings: RG; costs: Partial<CO>; tokens: TK } & NamedTarget<TG> & NamedRing<RG> & NamedToken<TK>;

/** The engine mirrors a target named `target` onto `context.target`, and likewise for rings and tokens. */
type NamedTarget<TG> = TG extends { target: infer T } ? { target: T } : unknown;
type NamedRing<RG> = RG extends { target: infer R } ? { ring: R } : unknown;
type NamedToken<TK> = TK extends { target: infer T } ? { token: T } : unknown;

/**
 * One method only: TypeScript infers `actions.x((context) => ...)` from it exactly, and since methods
 * compare bivariantly, an action built for a wider context fits too.
 */
interface BuilderAction<Base extends AbilityContext, TG, RG, CO, TK = object> {
    hasLegalTarget(context: BuilderContext<Base, TG, RG, CO, TK>, additionalProperties?: object): boolean;
}

function toGameAction(title: string, action: object): GameAction {
    if(!(action instanceof GameAction)) {
        throw new Error(`${title}: not a game action`);
    }
    return action;
}

function withGameActions(title: string, entry: { gameAction?: GameAction | GameAction[] }, actions: object[]): void {
    if(actions.length > 0) {
        const gameActions = actions.map((action) => toGameAction(title, action));
        entry.gameAction = gameActions.length === 1 ? gameActions[0] : gameActions;
    }
}

/** The target it depends on is set; other earlier ones may not be, as the engine checks independent targets alone. */
type Visible<Bag, D extends keyof Bag, Name extends string, V> = Pick<Bag, D> & Partial<Omit<Bag, D>> & { [P in Name]: V };
type Earlier<Bag, D extends keyof Bag> = Pick<Bag, D> & Partial<Omit<Bag, D>>;

/** A target may depend on any earlier target: a card, a ring, a token or a select. */
type Dependency<TG, RG, TK, SL> = ((keyof TG | keyof RG | keyof TK) & string) | SL;
type EarlierContext<Base extends AbilityContext, TG, RG, CO, TK, D> =
    BuilderContext<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>;
type CandidateContext<Base extends AbilityContext, TG, RG, CO, TK, D, Name extends string, V> =
    BuilderContext<Base, Visible<TG, D & keyof TG, Name, V>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>;

export type ActionContext<S extends BaseCard> = AbilityContext<S> & { ability: CardAction };

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

interface AbilityDraft {
    readonly title: string;
    readonly holdsBase: (context: AbilityContext) => boolean;
    readonly targets: Record<string, TargetEntry>;
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
    notPrinted?: boolean;
    anyPlayer?: boolean;
    collectiveTrigger?: boolean;
}

export function createDraft(title: string, holdsBase: (context: AbilityContext) => boolean): AbilityDraft {
    return { title, holdsBase, targets: {}, specs: [], costs: [], gameActions: [] };
}

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

function holdsCardOf<K extends CardType | readonly CardType[] | undefined>(cardType: K | undefined): (value: unknown) => value is CardOfType<K> {
    const types: readonly CardType[] | undefined = cardType === undefined ? undefined : isCardTypeList(cardType) ? cardType : [cardType];
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

const isCardTypeList = (cardType: CardType | readonly CardType[]): cardType is readonly CardType[] => Array.isArray(cardType);
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
        const mirrored = (spec: TargetSpec) => spec.name !== 'target' || mirror(spec) === value(spec);
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

    /** The card-choice properties every card-like target shares, with its callbacks checked. */
    #cardChoice<K extends CardType | readonly CardType[] | undefined>(props: CardChoiceProps<never, K, string>): CardChoiceEntry {
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

    /** A card condition that only sees cards of the declared type, with its context checked. */
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
        const Name extends string,
        const K extends CardType | readonly CardType[] | undefined = undefined,
        D extends Dependency<TG, RG, TK, SL> = never,
        const O extends boolean = false
    >(
        name: Name,
        props: CardTargetProps<
            CandidateContext<Base, TG, RG, CO, TK, D, Name, CardOfType<K>>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D,
            O
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<TG, D & keyof TG, Name, ChosenCard<K, O>>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG & { [P in Name]: ChosenCard<K, O> }, RG, CO, TK, SL> {
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
        return new AbilityBuilder(this.draft);
    }

    /** Several cards at once, by `mode`. Its callbacks see one candidate at a time; later ones, every card chosen. */
    targetCards<
        const Name extends string,
        const K extends CardType | readonly CardType[] | undefined = undefined,
        D extends Dependency<TG, RG, TK, SL> = never
    >(
        name: Name,
        props: CardsTargetProps<
            CandidateContext<Base, TG, RG, CO, TK, D, Name, CardOfType<K>>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<TG, D & keyof TG, Name, CardOfType<K> | CardOfType<K>[]>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG & { [P in Name]: CardOfType<K>[] }, RG, CO, TK, SL> {
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
        return new AbilityBuilder(this.draft);
    }

    #multiCardEntry<K extends CardType | readonly CardType[] | undefined, EarlierContext extends BuilderContext<Base, object, object, CO>>(
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
        const Name extends string,
        const K extends CardType | readonly CardType[] | undefined = undefined,
        D extends Dependency<TG, RG, TK, SL> = never,
        const O extends boolean = false
    >(
        name: Name,
        props: TokenTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, K, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Visible<TK, D & keyof TK, Name, StatusToken[]>>>[]
    ): AbilityBuilder<Base, TG, RG, CO, TK & { [P in Name]: ChosenTokens<O> }, SL> {
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
        const Name extends string,
        const K extends CardType | readonly CardType[] | undefined = undefined,
        D extends Dependency<TG, RG, TK, SL> = never
    >(
        name: Name,
        props: AbilityTargetProps<
            EarlierContext<Base & { targetAbility: CardAbility }, TG, RG, CO, TK, D>,
            EarlierContext<Base, TG, RG, CO, TK, D>,
            K,
            D
        >,
        ...gameActions: NoInfer<BuilderAction<Base & { targetAbility: CardAbility }, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base & { targetAbility: CardAbility }, TG, RG, CO, TK, SL> {
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
    elementTarget<const K extends CardType | readonly CardType[] | undefined = undefined>(
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
        this.draft.targets[name] = entry;
        if(own) {
            this.draft.specs.push(own);
        }
    }

    /** `ringCondition` gets the candidate as an argument: the engine's ring prompt doesn't set it on the context. */
    ringTarget<const Name extends string, D extends Dependency<TG, RG, TK, SL> = never, const O extends boolean = false>(
        name: Name,
        props: RingTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D, O>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<TG, D & keyof TG>, Visible<RG, D & keyof RG, Name, Ring>, CO, Earlier<TK, D & keyof TK>>>[]
    ): AbilityBuilder<Base, TG, RG & { [P in Name]: true extends O ? Ring | undefined : Ring }, CO, TK, SL> {
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
    select<const Name extends string, D extends Dependency<TG, RG, TK, SL> = never>(
        name: Name,
        props: SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        choices: NoInfer<Record<string, BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | Name> {
        this.#select(name, props, this.#actionChoices(choices));
        return new AbilityBuilder(this.draft);
    }

    /** Choices that only need to be available; the handler reads which one was picked from `context.select`. */
    selectIf<const Name extends string, D extends Dependency<TG, RG, TK, SL> = never>(
        name: Name,
        props: SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        conditions: Record<string, (context: EarlierContext<Base, TG, RG, CO, TK, D>) => boolean>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | Name> {
        const [required, optional] = this.#earlier(props.dependsOn);
        const checked: Record<string, (context: AbilityContext) => boolean> = {};
        for(const [label, condition] of Object.entries(conditions)) {
            checked[label] = this.#checked(condition, required, optional);
        }
        this.#select(name, props, checked);
        return new AbilityBuilder(this.draft);
    }

    /** Choices that depend on the context, such as a label naming an earlier target. */
    selectFrom<const Name extends string, D extends Dependency<TG, RG, TK, SL> = never>(
        name: Name,
        props: SelectTargetProps<EarlierContext<Base, TG, RG, CO, TK, D>, D>,
        choices: (context: EarlierContext<Base, TG, RG, CO, TK, D>) => Record<string, BuilderAction<Base, Earlier<TG, D & keyof TG>, Earlier<RG, D & keyof RG>, CO, Earlier<TK, D & keyof TK>>>
    ): AbilityBuilder<Base, TG, RG, CO, TK, SL | Name> {
        const [required, optional] = this.#earlier(props.dependsOn);
        const checked = this.#checked(choices, required, optional);
        this.#select(name, props, (context: AbilityContext) => this.#actionChoices(checked(context)));
        return new AbilityBuilder(this.draft);
    }

    #actionChoices(choices: Record<string, object>): Record<string, GameAction> {
        const actions: Record<string, GameAction> = {};
        for(const [label, choice] of Object.entries(choices)) {
            actions[label] = toGameAction(this.draft.title, choice);
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

    cost<R extends object>(cost: Cost<R>): AbilityBuilder<Base, TG, RG, CO & R, TK, SL> {
        this.draft.costs.push(cost);
        return new AbilityBuilder(this.draft);
    }

    condition(condition: (context: Base) => boolean): this {
        this.draft.condition = this.#checked(condition, []);
        return this;
    }

    gameAction(...actions: BuilderAction<Base, TG, RG, CO, TK>[]): this {
        this.draft.gameActions = this.draft.gameActions.concat(actions.map((action) => toGameAction(this.draft.title, action)));
        return this;
    }

    handler(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => void): this {
        this.draft.handler = this.#checked(fn, this.draft.specs);
        return this;
    }

    effect(message: string, args?: (context: BuilderContext<Base, TG, RG, CO, TK>) => EffectArg): this {
        this.draft.effect = message;
        this.draft.effectArgs = args && this.#checked(args, this.draft.specs);
        return this;
    }

    /** May return nothing: some cards use it only for a side effect. */
    then(fn: (context: BuilderContext<Base, TG, RG, CO, TK>) => object | undefined): this {
        this.draft.then = this.#checked(fn, this.draft.specs);
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

/** An aggregate trigger's context carries every event it fired on. */
type AggregateBase<S extends BaseCard, EventOptional extends boolean> = EventOptional extends true
    ? AbilityContext<S> & Pick<TriggeredAbilityContext<S>, 'cancel'> & { event?: Event[] }
    : TriggeredAbilityContext<S> & { event: Event[] };

export type AggregateWhen<S extends BaseCard> = (events: Event[], context: TriggeredAbilityContext<S>) => boolean;

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
        ...(draft.evenDuringDynasty ? { evenDuringDynasty: true } : {}),
        ...(draft.notPrinted ? { printedAbility: false } : {})
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
        ...(draft.anyPlayer ? { anyPlayer: true } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}

export function aggregateProperties<S extends BaseCard>(draft: AbilityDraft, aggregateWhen: AggregateWhen<S>): TriggeredAbilityAggregateWhenProps<S> {
    return {
        title: draft.title,
        aggregateWhen,
        ...commonProperties(draft),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}
