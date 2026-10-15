import type { AbilityContext } from './AbilityContext.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { CardAction } from './CardAction.js';
import BaseCard from './BaseCard.js';
import { CardAbility } from './CardAbility.js';
import { type CardType, type EventName, type Location, type Phase, Players, TargetMode, type Trait } from './Constants.js';
import type { Cost } from './costs/Cost.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import * as GameActions from './GameActions/GameActions.js';
import type { SelectCardProperties, SelectCardsProperties } from './GameActions/SelectCardAction.js';
import type { MultiCardMode } from './CardSelector.js';
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
import { msg, type MessageArgs } from './GameChat.js';
import type { ProvinceCard } from './ProvinceCard.js';
import Ring from './Ring.js';
import { ElementSymbol } from './ElementSymbol.js';
import { StatusToken } from './StatusToken.js';
import type { ThenAbilityProperties } from './ThenAbility.js';
import type { SelectChoice } from './AbilityTargets/SelectChoice.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import { isCardOfType, isCardTypeList, type CardOfType, type CardTypes } from './types/CardOfType.js';
import type { Derivable } from './utils/helpers.js';

/** A skipped optional target holds `[]`, or nothing if its prompt was hidden (`hideIfNoLegalTargets`). */
type ChosenCard<Types, Optional> = true extends Optional ? CardOfType<Types> | [] | undefined : CardOfType<Types>;

/** A skipped optional token target holds nothing. */
type ChosenTokens<Optional> = true extends Optional ? StatusToken[] | undefined : StatusToken[];

/** Cost results are only known once paid, so they are optional. */
type BuilderContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens = object> =
    Base & { targets: Targets; rings: Rings; costs: Partial<Costs>; tokens: Tokens } & NamedTarget<Targets> & NamedRing<Rings> & NamedToken<Tokens>;

/**
 * The engine mirrors one card chosen for a target named `target` onto `context.target`, and likewise
 * for rings and tokens. A list of cards is not mirrored, so where the value may be a list (a skipped
 * optional target, or a multi-card target's own actions) `context.target` may be unset.
 */
type NamedTarget<Targets> = Targets extends { target: infer Chosen }
    ? IsCardList<Chosen> extends true ? unknown : { target: SingleCard<Chosen> }
    : unknown;
/** Brackets stop the union from being split: true only if every possible value is a list. */
type IsCardList<Value> = [Value] extends [readonly unknown[]] ? true : false;
type SingleCard<Value> = Exclude<Value, readonly unknown[]> | (Value extends readonly unknown[] ? undefined : never);
type NamedRing<Rings> = Rings extends { target: infer Chosen } ? { ring: Chosen } : unknown;
type NamedToken<Tokens> = Tokens extends { target: infer Chosen } ? { token: Chosen } : unknown;

/**
 * One method only: TypeScript infers `actions.x((context) => ...)` from it exactly, and since methods
 * compare bivariantly, an action built for a wider context fits too.
 */
type BuilderAction<Base extends AbilityContext, Targets, Rings, Costs, Tokens = object> = DeclaredGameAction<BuilderContext<Base, Targets, Rings, Costs, Tokens>>;

/** Copies the listed properties that are set. */
function copyDefined<Source extends object>(to: object, from: Source, keys: readonly (keyof Source)[]): void {
    for(const key of keys) {
        if(from[key] !== undefined) {
            Object.assign(to, { [key]: from[key] });
        }
    }
}

/** The target it depends on is set; other earlier ones may not be, as the engine checks independent targets alone. */
type Visible<Bag, DependsOn extends keyof Bag, Name extends string, Value> = Pick<Bag, DependsOn> & Partial<Omit<Bag, DependsOn>> & { [Key in Name]: Value };
type Earlier<Bag, DependsOn extends keyof Bag> = Pick<Bag, DependsOn> & Partial<Omit<Bag, DependsOn>>;

type Dependency<Targets, Rings, Tokens, SelectNames> = ((keyof Targets | keyof Rings | keyof Tokens) & string) | SelectNames;
type EarlierContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens, DependsOn> =
    BuilderContext<Base, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>;
type CandidateContext<Base extends AbilityContext, Targets, Rings, Costs, Tokens, DependsOn, Name extends string, Value> =
    BuilderContext<Base, Visible<Targets, DependsOn & keyof Targets, Name, Value>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>;

export type ActionContext<Source extends BaseCard> = AbilityContext<Source> & { ability: CardAction };

/** A step's context: a new one for the same card, holding the earlier steps' targets. */
type StepContext<Base extends AbilityContext> = Base extends AbilityContext<infer Source> ? AbilityContext<Source> : AbilityContext;

type TriggerEvent<When> = GameEvent<Extract<EventName, keyof When>>;

export type TriggerContext<Source extends BaseCard, When> = TriggeredAbilityContext<Source> & { event: TriggerEvent<When> };

/** Countryside Trader resolves province triggers without their event. */
type ProvinceTriggerContext<Source extends BaseCard, When> = AbilityContext<Source> & Pick<TriggeredAbilityContext<Source>, 'cancel'> & { event?: TriggerEvent<When> };

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

/** Properties whose callbacks see the builder's context (the factory types them with a context parameter), or a function of that context returning them. */
type FactoryProperties<ActionName extends keyof GameActions.ActionProps<AbilityContext>, Context extends AbilityContext> =
    Derivable<GameActions.ActionProps<Context>[ActionName], Context>;

interface AbilityDraft {
    readonly title: string;
    readonly holdsBase: (context: AbilityContext) => boolean;
    readonly targets: Record<string, TargetEntry>;
    readonly specs: TargetSpec[];
    readonly costs: Cost[];
    gameActions: GameAction[];
    handler?: (context: AbilityContext) => void;
    condition?: (context: AbilityContext) => boolean;
    chatText?: string | ((context: AbilityContext) => MessageArgs);
    chatTextArgs?: (context: AbilityContext) => EffectArg;
    /** From a select's `{ action, chatText }` choices: the ability's chat line for the chosen label. */
    choiceChatText?: { select: string; texts: Record<string, string | ((context: AbilityContext) => MessageArgs)> };
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
    affinity?: Trait;
    /** From `onAffinity()`: a Yes/No question before using the affinity, and what the chat says it does. */
    affinityOptions?: AffinityOptions;
    /**
     * From `if()` / `ifAble()` / `otherwise()`: the game actions from `from` on are the branches, on `target` when they follow a card target
     * without game actions. Without a condition, the first branch resolves when it can (`ifAble()`).
     */
    branch?: { condition?: (context: AbilityContext) => boolean; from: number; otherwiseFrom?: number; target?: string };
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
    playCondition?: (context: AbilityContext) => boolean;
}

/** Settings of the ability itself: a then step can't have them. */
const ABILITY_ONLY = ['condition', 'limit', 'max', 'location', 'cannotBeMirrored', 'cannotTargetFirst', 'initiateDuel', 'phase', 'evenDuringDynasty',
    'conflictProvinceCondition', 'canTriggerOutsideConflict', 'notPrinted', 'anyPlayer', 'collectiveTrigger', 'playCondition'] as const;

/** What only an action's context has; a trigger's or a step's `ability` isn't a `CardAction`. */
type ActionOnly = { ability: CardAction };

/** What only a trigger's context has. */
type TriggerOnly = Pick<TriggeredAbilityContext, 'cancel'>;

export function createDraft(title: string, holdsBase: (context: AbilityContext) => boolean): AbilityDraft {
    return { title, holdsBase, targets: {}, specs: [], costs: [], gameActions: [] };
}

/** A target's name in `context.targets` (or `context.selects`); 'target' is also `context.target` and `{0}` in the effect message. */
type Named<Name extends string> = { name?: Name };

/**
 * A select's choice: a game action, a condition for a choice without game actions, or a game action with the
 * ability's chat text when it is chosen (a format whose `{0}` is the target, or a `msg` template).
 */
type SelectChoiceValue<Base extends AbilityContext, Targets, Rings, Costs, Tokens, DependsOn> =
    | BuilderAction<Base, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>
    | ((context: EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>) => boolean)
    | {
        action: BuilderAction<Base, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>;
        chatText: string | ((context: EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>) => MessageArgs);
    };

/** The label chosen in a select: `context.selects[name].choice`, and `context.select` for the select named 'target'. */
type Selected<Name extends string, Label extends string> =
    { selects: { [Key in Name]: SelectChoice<Label> } } & ('target' extends Name ? { select: Label } : unknown);

/** A target given no name is named 'target'. */
type TargetName<Name> = [Name] extends [never] ? 'target' : Name;

interface CardChoiceProps<EarlierContext, Types, DependsOn> {
    cardType?: Types;
    location?: Location | Location[];
    controller?: Players | ((context: EarlierContext) => Players);
    player?: Players.Self | Players.Opponent | ((context: EarlierContext) => Players.Self | Players.Opponent);
    activePromptTitle?: string;
    dependsOn?: DependsOn;
    hideIfNoLegalTargets?: boolean;
}

interface CardTargetProps<Context, EarlierContext, Types, DependsOn, Optional> extends CardChoiceProps<EarlierContext, Types, DependsOn> {
    optional?: Optional;
    cardCondition?: (card: CardOfType<Types>, context: Context) => boolean;
}

type CardsModeProps<EarlierContext, Types> =
    | { mode: TargetMode.Exactly | TargetMode.UpTo; numCards: number; sameDiscardPile?: boolean }
    | { mode: TargetMode.ExactlyVariable | TargetMode.UpToVariable; numCardsFunc: (context: EarlierContext) => number }
    | { mode: TargetMode.MaxStat; numCards: number; cardStat: (card: CardOfType<Types>) => number; maxStat: () => number }
    | { mode: TargetMode.Unlimited };

type CardsTargetProps<Context, EarlierContext, Types, DependsOn> = CardChoiceProps<EarlierContext, Types, DependsOn> & CardsModeProps<EarlierContext, Types> & {
    optional?: boolean;
    cardCondition?: (card: CardOfType<Types>, context: Context) => boolean;
};

interface TokenTargetProps<EarlierContext, Types, DependsOn, Optional> extends CardChoiceProps<EarlierContext, Types, DependsOn> {
    optional?: Optional;
    tokenCondition?: (token: StatusToken, context: EarlierContext) => boolean;
    cardCondition?: (card: CardOfType<Types>, context: EarlierContext) => boolean;
}

interface AbilityTargetProps<Context, EarlierContext, Types extends CardType, DependsOn> extends CardChoiceProps<EarlierContext, Types, DependsOn> {
    /** The type of the card the chosen ability is printed on: one type, which the engine compares with it. */
    cardType: Types;
    abilityCondition?: (ability: CardAbility) => boolean;
    cardCondition?: (card: CardOfType<Types>, context: Context) => boolean;
}

interface RingTargetProps<Context, DependsOn, Optional> {
    activePromptTitle?: string;
    dependsOn?: DependsOn;
    player?: Players.Self | Players.Opponent;
    optional?: Optional;
    hideIfNoLegalTargets?: boolean;
    ringCondition: (ring: Ring, context: Context) => boolean;
}

interface SelectTargetProps<Context, DependsOn> {
    activePromptTitle?: string;
    dependsOn?: DependsOn;
    player?: Players.Self | Players.Opponent | ((context: Context) => Players.Self | Players.Opponent);
    targets?: boolean;
    condition?: (context: Context) => boolean;
}

function holdsCardOf<Types extends CardTypes>(cardType: Types | undefined): (value: unknown) => value is CardOfType<Types> {
    const isCard = isCardOfType(cardType);
    return (value: unknown): value is CardOfType<Types> => value instanceof BaseCard && isCard(value);
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
    #once<Key extends keyof AbilityDraft>(key: Key, value: AbilityDraft[Key], call: string): void {
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
    #isContext<CheckedContext extends BuilderContext<Base, object, object, Costs>>(context: AbilityContext, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): context is CheckedContext {
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

    #checked<CheckedContext extends BuilderContext<Base, object, object, Costs>, Result>(fn: (context: CheckedContext) => Result, required: readonly TargetSpec[], optional: readonly TargetSpec[] = []): (context: AbilityContext) => Result {
        return (context) => {
            if(!this.#isContext<CheckedContext>(context, required, optional)) {
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

    #cardChoice<Types extends CardTypes>(props: CardChoiceProps<never, Types, string>): CardChoiceEntry {
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

    #cardCondition<Card, TargetContext extends BuilderContext<Base, object, object, Costs>>(
        holdsCard: (value: unknown) => value is Card,
        condition: (card: Card, context: TargetContext) => boolean,
        required: readonly TargetSpec[],
        optional: readonly TargetSpec[]
    ): (card: DrawCard, context: AbilityContext) => boolean {
        return (engineCard, context) => {
            const card: unknown = engineCard;
            if(!holdsCard(card)) {
                return false;
            }
            if(!this.#isContext<TargetContext>(context, required, optional)) {
                throw this.#contextError();
            }
            return condition(card, context);
        };
    }

    target<
        const Name extends string = never,
        const Types extends CardTypes = undefined,
        DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never,
        const Optional extends boolean = false
    >(
        props: Named<Name> & CardTargetProps<
            CandidateContext<Base, Targets, Rings, Costs, Tokens, DependsOn, TargetName<NoInfer<Name>>, CardOfType<Types>>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>,
            Types,
            DependsOn,
            Optional
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<Targets, DependsOn & keyof Targets, TargetName<Name>, ChosenCard<Types, Optional>>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets & { [Key in TargetName<Name>]: ChosenCard<Types, Optional> }, Rings, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<Types>(props.cardType);
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
        const Types extends CardTypes = undefined,
        DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never
    >(
        props: Named<Name> & CardsTargetProps<
            CandidateContext<Base, Targets, Rings, Costs, Tokens, DependsOn, TargetName<NoInfer<Name>>, CardOfType<Types>>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>,
            Types,
            DependsOn
        >,
        ...gameActions: NoInfer<BuilderAction<Base, Visible<Targets, DependsOn & keyof Targets, TargetName<Name>, CardOfType<Types> | CardOfType<Types>[]>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets & { [Key in TargetName<Name>]: CardOfType<Types>[] }, Rings, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<Types>(props.cardType);
        const candidate: TargetSpec = { bag: 'targets', name, holds: holdsCard };
        const own: TargetSpec = { bag: 'targets', name, holds: (value) => Array.isArray(value) && value.every(holdsCard) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry = this.#multiCardEntry(this.#cardChoice(props), props, holdsCard, earlier, others);
        this.#addCardTarget(name, entry, props, holdsCard, candidate, own, gameActions);
        return new AbilityBuilder(this.draft);
    }

    /** What `target()` and `targetCards()` share: its callbacks see the candidate card, later ones what was chosen. */
    #addCardTarget<Card, TargetContext extends BuilderContext<Base, object, object, Costs>>(
        name: string,
        entry: SingleCardEntry | MultiCardEntry,
        props: { dependsOn?: string; optional?: boolean; cardCondition?: (card: Card, context: TargetContext) => boolean },
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

    #multiCardEntry<Types extends CardTypes, EarlierContext extends BuilderContext<Base, object, object, Costs>>(
        choice: CardChoiceEntry,
        props: CardsModeProps<EarlierContext, Types>,
        holdsCard: (value: unknown) => value is CardOfType<Types>,
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
        const Types extends CardTypes = undefined,
        DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never,
        const Optional extends boolean = false
    >(
        props: Named<Name> & TokenTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>, Types, DependsOn, Optional>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Visible<Tokens, DependsOn & keyof Tokens, TargetName<Name>, StatusToken[]>>>[]
    ): AbilityBuilder<Base, Targets, Rings, Costs, Tokens & { [Key in TargetName<Name>]: ChosenTokens<Optional> }, SelectNames> {
        const name = props.name ?? 'target';
        const holdsCard = holdsCardOf<Types>(props.cardType);
        const own: TargetSpec = { bag: 'tokens', name, holds: (value) => holdsTokens(value) || (props.optional === true && value === undefined) };
        const [earlier, others] = this.#earlier(props.dependsOn);
        const entry: TokenEntry = { ...this.#cardChoice(props), mode: TargetMode.Token };
        if(props.optional !== undefined) {
            entry.optional = props.optional;
        }
        const { tokenCondition } = props;
        if(tokenCondition) {
            const checked = this.#checked((context: EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>) => context, earlier, others);
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
        const Types extends CardType,
        DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never
    >(
        props: AbilityTargetProps<
            EarlierContext<Base & { targetAbility: CardAbility }, Targets, Rings, Costs, Tokens, DependsOn>,
            EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>,
            Types,
            DependsOn
        >,
        ...gameActions: NoInfer<BuilderAction<Base & { targetAbility: CardAbility }, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>>[]
    ): AbilityBuilder<Base & { targetAbility: CardAbility }, Targets, Rings, Costs, Tokens, SelectNames> {
        const name = 'target';
        const holdsCard = holdsCardOf<Types>(props.cardType);
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
    elementTarget<const Types extends CardTypes = undefined>(
        props: Pick<CardChoiceProps<never, Types, never>, 'cardType' | 'location' | 'activePromptTitle'>,
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
    ringTarget<const Name extends string = never, DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never, const Optional extends boolean = false>(
        props: Named<Name> & RingTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>, DependsOn, Optional>,
        ...gameActions: NoInfer<BuilderAction<Base, Earlier<Targets, DependsOn & keyof Targets>, Visible<Rings, DependsOn & keyof Rings, TargetName<Name>, Ring>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>>[]
    ): AbilityBuilder<Base, Targets, Rings & { [Key in TargetName<Name>]: true extends Optional ? Ring | undefined : Ring }, Costs, Tokens, SelectNames> {
        const name = props.name ?? 'target';
        const own: TargetSpec = { bag: 'rings', name, holds: (value) => holdsRing(value) || (props.optional === true && value === undefined) };
        const [required, others] = this.#earlier(props.dependsOn);
        const optional = others.concat(own);
        const entry: RingEntry = {
            mode: TargetMode.Ring,
            ringCondition: (ring, context) => {
                if(!this.#isContext<EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>>(context, required, optional)) {
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
    /** The player chooses one of the labelled choices when the ability initiates; `select(choices)` without other properties. */
    select<const Label extends string = string>(
        choices: Record<Label, NoInfer<SelectChoiceValue<Base, Targets, Rings, Costs, Tokens, never>>>
    ): AbilityBuilder<Base & Selected<'target', Label>, Targets, Rings, Costs, Tokens, SelectNames | 'target'>;
    select<const Name extends string = never, DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never, const Label extends string = string>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>, DependsOn>,
        choices: Record<Label, NoInfer<SelectChoiceValue<Base, Targets, Rings, Costs, Tokens, DependsOn>>>
    ): AbilityBuilder<Base & Selected<TargetName<Name>, Label>, Targets, Rings, Costs, Tokens, SelectNames | TargetName<Name>>;
    select(...args: [choices: Record<string, unknown>] | [props: Named<string> & SelectTargetProps<never, string>, choices: Record<string, unknown>]): unknown {
        const [props, choices] = args.length === 1 ? [{}, args[0]] : args;
        const name = props.name ?? 'target';
        const [required, optional] = this.#earlier(props.dependsOn);
        const entries: Record<string, GameAction | ((context: AbilityContext) => boolean)> = {};
        const texts: Record<string, string | ((context: AbilityContext) => MessageArgs)> = {};
        for(const [label, choice] of Object.entries(choices)) {
            if(isCondition(choice)) {
                // a condition is a choice without game actions ("No"), available while it holds
                entries[label] = this.#checked(choice, required, optional);
            } else if(isTextChoice(choice)) {
                entries[label] = this.#toAction(choice.action);
                texts[label] = typeof choice.chatText === 'string' ? choice.chatText : this.#checked(choice.chatText, required, optional);
            } else {
                entries[label] = this.#toAction(choice instanceof Object ? choice : {});
            }
        }
        if(Object.keys(texts).length > 0) {
            this.#once('choiceChatText', { select: name, texts }, 'a select with chatText choices');
        }
        this.#select(name, props, entries);
        return new AbilityBuilder(this.draft);
    }

    /** Choices that depend on the context, such as a label naming an earlier target. */
    selectFrom<const Name extends string = never, DependsOn extends Dependency<Targets, Rings, Tokens, SelectNames> = never>(
        props: Named<Name> & SelectTargetProps<EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>, DependsOn>,
        choices: (context: EarlierContext<Base, Targets, Rings, Costs, Tokens, DependsOn>) => Record<string, BuilderAction<Base, Earlier<Targets, DependsOn & keyof Targets>, Earlier<Rings, DependsOn & keyof Rings>, Costs, Earlier<Tokens, DependsOn & keyof Tokens>>>
    ): AbilityBuilder<Base & Selected<TargetName<Name>, string>, Targets, Rings, Costs, Tokens, SelectNames | TargetName<Name>> {
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

    cost<Results extends object>(cost: Cost<Results, Base>): AbilityBuilder<Base, Targets, Rings, Costs & Results, Tokens, SelectNames> {
        this.draft.costs.push(cost);
        return new AbilityBuilder(this.draft);
    }

    condition(condition: (context: Base) => boolean): this {
        this.#once('condition', this.#checked(condition, []), 'condition()');
        return this;
    }

    /** An event's "play only if …": a play restriction, which effects ignoring triggering conditions still respect. */
    playOnlyIf(condition: (context: Base) => boolean): this {
        this.#once('playCondition', this.#checked(condition, []), 'playOnlyIf()');
        return this;
    }

    /**
     * "With [trait] affinity" (usually an element, but any trait, e.g. Shadow): this step's game actions resolve only if the player has that affinity.
     * `activePromptTitle` asks the player first ("Pay 1 fate to swap abilities?"); `chatText` is what the chat says the affinity does.
     */
    onAffinity(trait: Trait, options: AffinityOptions<BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        this.#once('affinity', trait, 'onAffinity()');
        this.draft.affinityOptions = {
            ...(options.activePromptTitle !== undefined ? { activePromptTitle: options.activePromptTitle } : {}),
            ...(options.chatText ? { chatText: this.#checked(options.chatText, this.draft.specs) } : {})
        };
        return this;
    }

    /**
     * "If …": the game actions after it resolve only when `condition` holds, the ones after otherwise() (if any) when it doesn't.
     * Right after a card target, they are that target's: they resolve on the chosen card, after its own game actions if it has any
     * (after several card targets without game actions, they stay on the ability).
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
     * "…, if able. Otherwise, …": the game actions after it resolve when they can, the ones after otherwise() when they can't.
     * They stay on the ability, also after a card target, so they name their targets.
     */
    ifAble(): this {
        if(this.draft.branch) {
            throw new Error(`${this.draft.title}: one if() per step`);
        }
        this.draft.branch = { from: this.draft.gameActions.length };
        return this;
    }

    /**
     * The card target the branches belong to: the last target, when it is the only card target without game actions,
     * or when it has game actions of its own and the ability none yet. With several bare card targets, none is meant
     * more than another, so the branches stay on the ability.
     */
    #branchTarget(): string | undefined {
        const cardTargets = this.draft.cardTargets ?? [];
        const hasActions = (name: string) => {
            const entry = this.draft.targets[name];
            return 'gameAction' in entry && entry.gameAction !== undefined;
        };
        const names = Object.keys(this.draft.targets);
        const last = names[names.length - 1];
        if(last !== undefined && cardTargets.includes(last) && hasActions(last) && this.draft.gameActions.length === 0) {
            return last;
        }
        const bare = cardTargets.filter((name) => !hasActions(name));
        return bare.length === 1 && bare[0] === last ? bare[0] : undefined;
    }

    /** "Otherwise, …": the game actions after it resolve when the if() condition doesn't hold, or the ifAble() ones can't resolve. */
    otherwise(): this {
        if(!this.draft.branch || this.draft.branch.otherwiseFrom !== undefined) {
            throw new Error(`${this.draft.title}: otherwise() follows an if() or ifAble()`);
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

    /** Taints the target (the source by default). */
    taint(properties: FactoryProperties<'taint', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.taint(properties));
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

    atEndOfConflict(properties: FactoryProperties<'atEndOfConflict', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.atEndOfConflict(properties));
    }

    /** A lasting effect on players. */
    playerLastingEffect(properties: FactoryProperties<'playerLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.playerLastingEffect(properties));
    }

    ringLastingEffect(properties: FactoryProperties<'ringLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.ringLastingEffect(properties));
    }

    conflictLastingEffect(properties: FactoryProperties<'conflictLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.conflictLastingEffect(properties));
    }

    /** The player (or `player`) chooses a card when the ability resolves, and `gameAction` resolves on it. */
    selectCard<const Types extends CardTypes = CardTypes>(
        properties: SelectCardProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types> | ((context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => SelectCardProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types>)
    ): this {
        return this.gameAction(GameActions.selectCard<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types>(properties));
    }

    /** The player (or `player`) chooses several cards, by `mode`, when the ability resolves, and `gameAction` resolves on them. */
    selectCards<const Types extends CardTypes = CardTypes>(
        properties: SelectCardsProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types> & { mode: MultiCardMode }
            | ((context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => SelectCardsProperties<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types> & { mode: MultiCardMode })
    ): this {
        return this.gameAction(GameActions.selectCards<BuilderContext<Base, Targets, Rings, Costs, Tokens>, Types>(properties));
    }

    selectAttackedProvince(properties: FactoryProperties<'selectAttackedProvince', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.selectAttackedProvince(properties));
    }

    /** Searches a deck: look at its top cards, choose some, and resolve `gameAction` on them. */
    deckSearch(properties: FactoryProperties<'deckSearch', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.deckSearch(properties));
    }

    /** Discards random cards from the hand of the target (the opponent by default). */
    discardAtRandom(properties: FactoryProperties<'discardAtRandom', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.discardAtRandom(properties));
    }

    /** Discards the target cards (the source by default) from a hand, deck or province. */
    discardCard(properties: FactoryProperties<'discardCard', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.discardCard(properties));
    }

    /** The target player (the opponent by default) chooses cards in their hand to discard. */
    chosenDiscard(properties: FactoryProperties<'chosenDiscard', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.chosenDiscard(properties));
    }

    /** Moves the target cards (the source by default) to `destination`. */
    moveCard(properties: FactoryProperties<'moveCard', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.moveCard(properties));
    }

    /** Shuffles the target player's (the player of the ability by default) `deck`. */
    shuffleDeck(properties: FactoryProperties<'shuffleDeck', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.shuffleDeck(properties));
    }

    /** Returns the target (the source by default) to its owner's hand. */
    returnToHand(properties: FactoryProperties<'returnToHand', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.returnToHand(properties));
    }

    /** Puts the target (the source by default) into play. */
    putIntoPlay(properties: FactoryProperties<'putIntoPlay', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.putIntoPlay(properties));
    }

    /** Puts the target (the source by default) into play in the conflict. */
    putIntoConflict(properties: FactoryProperties<'putIntoConflict', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.putIntoConflict(properties));
    }

    /** Attaches `attachment` to the target (the source by default). */
    attach(properties: FactoryProperties<'attach', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.attach(properties));
    }

    /** Places the target (the source by default) underneath `destination`. */
    placeCardUnderneath(properties: FactoryProperties<'placeCardUnderneath', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.placeCardUnderneath(properties));
    }

    /** Removes the target (the source by default) from the game. */
    removeFromGame(properties: FactoryProperties<'removeFromGame', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.removeFromGame(properties));
    }

    /** Returns the target (the source by default) to its owner's deck. */
    returnToDeck(properties: FactoryProperties<'returnToDeck', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.returnToDeck(properties));
    }

    /** Resolves the conflict ring's effect. */
    resolveConflictRing(properties: FactoryProperties<'resolveConflictRing', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.resolveConflictRing(properties));
    }

    /** A ring is chosen while the ability resolves, and `gameAction` resolves on it. */
    selectRing(properties: FactoryProperties<'selectRing', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.selectRing(properties));
    }

    /** A token is chosen while the ability resolves, and `gameAction` resolves on it. */
    selectToken(properties: FactoryProperties<'selectToken', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.selectToken(properties));
    }

    /** Switches the type of the current conflict. */
    switchConflictType(properties: FactoryProperties<'switchConflictType', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.switchConflictType(properties));
    }

    /** The target player (the player of the ability by default) claims the Imperial Favor. */
    claimImperialFavor(properties: FactoryProperties<'claimImperialFavor', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.claimImperialFavor(properties));
    }

    /** The target player (the player of the ability by default) declares a conflict. */
    initiateConflict(properties: FactoryProperties<'initiateConflict', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.initiateConflict(properties));
    }

    /** Resolves the target ring's effect. */
    resolveRingEffect(properties: FactoryProperties<'resolveRingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.resolveRingEffect(properties));
    }

    /** Places fate on the target ring. */
    placeFateOnRing(properties: FactoryProperties<'placeFateOnRing', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.placeFateOnRing(properties));
    }

    /** A lasting effect on the current duel. */
    duelLastingEffect(properties: FactoryProperties<'duelLastingEffect', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.duelLastingEffect(properties));
    }

    /** The player looks at the target cards (the source by default). */
    lookAt(properties: FactoryProperties<'lookAt', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.lookAt(properties));
    }

    reveal(properties: FactoryProperties<'reveal', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.reveal(properties));
    }

    discardStatusToken(properties: FactoryProperties<'discardStatusToken', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.discardStatusToken(properties));
    }

    playCard(properties: FactoryProperties<'playCard', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.playCard(properties));
    }

    /** Removes a fate from the target character, or discards it if it has none (the source by default). */
    injure(properties: FactoryProperties<'injure', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.injure(properties));
    }

    /** Adds a token to the target (the source by default). */
    addToken(properties: FactoryProperties<'addToken', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.addToken(properties));
    }

    /** Changes the target player's honor bid. */
    modifyBid(properties: FactoryProperties<'modifyBid', BuilderContext<Base, Targets, Rings, Costs, Tokens>> = {}): this {
        return this.gameAction(GameActions.modifyBid(properties));
    }

    /** One of `cards` is chosen from card buttons while the ability resolves, and `gameAction` resolves on it. */
    cardMenu(properties: FactoryProperties<'cardMenu', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.cardMenu(properties));
    }

    /** A choice between game actions while the ability resolves (a selection after the dash). */
    chooseAction(properties: FactoryProperties<'chooseAction', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.chooseAction(properties));
    }

    /** A number is chosen while the ability resolves, and `gameAction(amount)` resolves. */
    chooseAmount(properties: FactoryProperties<'chooseAmount', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.chooseAmount(properties));
    }

    /** A player may resolve `gameAction` (Yes/No). */
    optional(properties: FactoryProperties<'optional', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.optional(properties));
    }

    /** The top card of a deck becomes a token, then `gameAction(token)` resolves. */
    tokenFromTopCard(properties: FactoryProperties<'tokenFromTopCard', BuilderContext<Base, Targets, Rings, Costs, Tokens>>): this {
        return this.gameAction(GameActions.tokenFromTopCard(properties));
    }

    /** A chat line as one of the step's actions; nothing when the function returns `undefined`. */
    chatMessage(message: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs | undefined): this {
        return this.gameAction(GameActions.chatMessage(this.#checked(message, this.draft.specs)));
    }

    /** Cancels the triggering event (interrupts only), optionally replacing it with `replacementGameAction`. */
    cancel<Narrowed extends Base & CancellingContext>(
        this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>,
        properties: FactoryProperties<'cancel', BuilderContext<Narrowed, Targets, Rings, Costs, Tokens>> = {}
    ): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
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

    /**
     * What the chat says the ability does, after "{player} uses {card} to …": a format whose `{0}` is the target,
     * with its later arguments; or a `msg` template.
     */
    chatText(message: string, args?: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => EffectArg): this;
    chatText(message: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs): this;
    chatText(
        message: string | ((context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => MessageArgs),
        args?: (context: BuilderContext<Base, Targets, Rings, Costs, Tokens>) => EffectArg
    ): this {
        if(this.draft.isStep) {
            throw new Error(`${this.draft.title}: a then step prints its message with message()`);
        }
        this.#once('chatText', typeof message === 'string' ? message : this.#checked(message, this.draft.specs), 'chatText()');
        this.draft.chatTextArgs = args && this.#checked(args, this.draft.specs);
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
                    message: (choiceContext: AbilityContext) =>
                        msg`${choiceContext.player} chooses ${choiceContext.select === 'Done' ? 'not ' : ''}to ${verb} for no effect`
                };
            }
            return {
                inheritTargets: true,
                target: { mode: TargetMode.Select, choices: { [`${label} to resolve this ability again`]: cost, Done: () => true } },
                message: (choiceContext: AbilityContext) =>
                    msg`${choiceContext.player} chooses ${choiceContext.select === 'Done' ? 'not ' : ''}to ${verb} to resolve ${choiceContext.source} again`,
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
            throw new Error(`${this.draft.title}: the ability's own message is its chatText()`);
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
    phase<Narrowed extends Base & ActionOnly>(this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>, phase: Phase | 'any'): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('phase', phase, 'phase()');
        return this;
    }

    /** Actions only: usable in the Dynasty phase without the per-type restrictions. */
    evenDuringDynasty<Narrowed extends Base & ActionOnly>(this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('evenDuringDynasty', true, 'evenDuringDynasty()');
        return this;
    }

    /** Province actions only: usable when no conflict is at a province. */
    canTriggerOutsideConflict<Narrowed extends Base & ActionOnly & { source: ProvinceCard }>(this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('canTriggerOutsideConflict', true, 'canTriggerOutsideConflict()');
        return this;
    }

    /** Province actions only: which conflict provinces allow the action (by default this one). */
    conflictProvinceCondition<Narrowed extends Base & ActionOnly & { source: ProvinceCard }>(
        this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>,
        condition: (province: ProvinceCard, context: Narrowed) => boolean
    ): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
        const checked = this.#checked((context: Narrowed) => context, []);
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
    collectiveTrigger<Narrowed extends Base & TriggerOnly>(this: AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames>): AbilityBuilder<Narrowed, Targets, Rings, Costs, Tokens, SelectNames> {
        this.#once('collectiveTrigger', true, 'collectiveTrigger()');
        return this;
    }
}

export type TriggerBase<Source extends BaseCard, When, EventOptional extends boolean> =
    EventOptional extends true ? ProvinceTriggerContext<Source, When> : TriggerContext<Source, When>;

type AggregateBase<Source extends BaseCard, EventOptional extends boolean> = EventOptional extends true
    ? AbilityContext<Source> & Pick<TriggeredAbilityContext<Source>, 'cancel'> & { event?: Event[] }
    : TriggeredAbilityContext<Source> & { event: Event[] };

type AggregateWhen<Source extends BaseCard> = (events: Event[], context: TriggeredAbilityContext<Source, BaseCard, Event[]>) => boolean;

interface TriggerStarts<Source extends BaseCard> {
    when<When extends WhenType<Source>>(when: When): AbilityDraft;
    aggregateWhen(aggregateWhen: AggregateWhen<Source>): AbilityDraft;
}

export class TriggerBuilder<Source extends BaseCard, EventOptional extends boolean = false> {
    constructor(private readonly starts: TriggerStarts<Source>) {}

    when<When extends WhenType<Source>>(when: When): AbilityBuilder<TriggerBase<Source, When, EventOptional>> {
        return new AbilityBuilder<TriggerBase<Source, When, EventOptional>>(this.starts.when(when));
    }

    /** Triggers on a window's events together, e.g. on the total fate they moved. */
    aggregateWhen(aggregateWhen: AggregateWhen<Source>): AbilityBuilder<AggregateBase<Source, EventOptional>> {
        return new AbilityBuilder<AggregateBase<Source, EventOptional>>(this.starts.aggregateWhen(aggregateWhen));
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

/** A select choice that is a condition: a choice without game actions. */
function isCondition(choice: unknown): choice is (context: AbilityContext) => boolean {
    return typeof choice === 'function';
}

/** A `{ action, chatText }` select choice; a game action has neither field. */
function isTextChoice(choice: unknown): choice is { action: object; chatText: string | ((context: AbilityContext) => MessageArgs) } {
    return choice instanceof Object && 'action' in choice && 'chatText' in choice;
}

/** The chat text: the ability's own, or the chosen select choice's (the game actions' text for a choice without one). */
function chatTextProperties(draft: AbilityDraft): { chatText?: AbilityDraft['chatText'] | ((context: AbilityContext) => MessageArgs | undefined) } {
    const choices = draft.choiceChatText;
    if(!choices) {
        return draft.chatText !== undefined ? { chatText: draft.chatText } : {};
    }
    if(draft.chatText !== undefined) {
        throw new Error(`${draft.title}: chatText() and a select's chatText choices both say what the ability does`);
    }
    return {
        chatText: (context) => {
            const text = choices.texts[context.selects[choices.select]?.choice ?? ''];
            return typeof text === 'string' ? [text, [context.chatTarget()]] : text?.(context);
        }
    };
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
        ...chatTextProperties(draft),
        ...(draft.chatTextArgs ? { chatTextArgs: draft.chatTextArgs } : {}),
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
        message: (choiceContext: AbilityContext) => {
            const not = choiceContext.select === 'No' ? 'not ' : '';
            return opponent
                ? msg`${player} chooses ${not}to resolve ${choiceContext.source}'s ability again`
                : msg`${choiceContext.player} chooses ${not}to resolve ${choiceContext.source} again`;
        }
    };
}

/** A number is the action's `amount`. */
const amountProperties = <Properties>(properties: number | Properties): Properties | { amount: number } => typeof properties === 'number' ? { amount: properties } : properties;

const oneAction = (actions: GameAction[]) => actions.length === 1 ? actions[0] : GameActions.multiple(actions);

/** The draft with its if() branches in one conditional action: on the ability, or on the card target they follow. */
function withBranches(draft: AbilityDraft): AbilityDraft {
    const branch = draft.branch;
    if(!branch) {
        return draft;
    }
    const actions = draft.gameActions;
    const condition = branch.condition;
    if(!condition && branch.otherwiseFrom === undefined) {
        throw new Error(`${draft.title}: ifAble() needs an otherwise()`);
    }
    const yes = actions.slice(branch.from, branch.otherwiseFrom);
    // without otherwise() the false branch does nothing and has no legal target, so an ability whose only
    // effect is a failing if() can't be used (RRG: its effect must be able to change the game state)
    const no = branch.otherwiseFrom === undefined ? [GameActions.multiple([])] : actions.slice(branch.otherwiseFrom);
    if(yes.length === 0 || no.length === 0) {
        throw new Error(`${draft.title}: if() and otherwise() each need a game action`);
    }
    const conditional = (trueActions: GameAction[], falseActions: GameAction[]) => condition
        ? GameActions.conditional({ condition: (context) => condition(context), trueGameAction: oneAction(trueActions), falseGameAction: oneAction(falseActions) })
        : GameActions.ifAble({ ifAbleGameAction: oneAction(trueActions), otherwiseGameAction: oneAction(falseActions) });
    const before = actions.slice(0, branch.from);
    if(branch.target === undefined) {
        return { ...draft, branch: undefined, gameActions: [...before, conditional(yes, no)] };
    }
    const entry = draft.targets[branch.target];
    const own = 'gameAction' in entry ? entry.gameAction : undefined;
    // a target's own actions go into both branches: without otherwise(), the false branch is just them, so
    // only cards they (or the true branch, when it holds) can affect stay selectable
    const ownActions = own === undefined ? [] : Array.isArray(own) ? own : [own];
    const gameAction = ownActions.length === 0
        ? conditional(yes, no)
        : conditional([...ownActions, ...yes], branch.otherwiseFrom === undefined ? ownActions : [...ownActions, ...no]);
    return { ...draft, branch: undefined, gameActions: before, targets: { ...draft.targets, [branch.target]: { ...entry, gameAction } } };
}

interface AffinityOptions<Context = AbilityContext> {
    activePromptTitle?: string;
    chatText?: (context: Context) => MessageArgs;
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
    const { activePromptTitle, chatText } = draft.affinityOptions ?? {};
    return { gameAction: [GameActions.onAffinity({
        trait,
        gameAction,
        ...(activePromptTitle !== undefined ? { activePromptTitle } : {}),
        ...(chatText ? { chatText } : {})
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
    if(step.chatText !== undefined || step.choiceChatText !== undefined) {
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

export function toActionProps<Source extends BaseCard>(draft: AbilityDraft): ActionProps<Source> {
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

export function toTriggerProps<Source extends BaseCard>(draft: AbilityDraft, when: WhenType<Source>): TriggeredAbilityWhenProps<Source> {
    return {
        title: draft.title,
        when,
        ...commonProperties(draft),
        ...(draft.condition ? { condition: draft.condition } : {}),
        ...(draft.anyPlayer ? { anyPlayer: true } : {}),
        ...(draft.collectiveTrigger ? { collectiveTrigger: true } : {})
    };
}

export function toAggregateProps<Source extends BaseCard>(draft: AbilityDraft, aggregateWhen: AggregateWhen<Source>): TriggeredAbilityAggregateWhenProps<Source> {
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
