import { ConflictType } from './Constants.js';
import type { AbilityContext } from './AbilityContext.js';
import type { EventPayload } from './Events/EventPayloads.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { DeclaredGameAction } from './BaseAbility.js';
import type { Event } from './Events/Event.js';
import type { Cost } from './costs/Cost.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type Ring from './Ring.js';
import type BaseCard from './BaseCard.js';
import type { Faction } from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type { EffectSource } from './EffectSource.js';
import type { CardAbility } from './CardAbility.js';
import type { DuelProperties } from './GameActions/DuelAction.js';
import type { EffectFactory, EffectTarget } from './Effects/EffectBuilder.js';
import type { Players, TargetMode, CardType, Location, EventName, Phases } from './Constants.js';
import type { StatusToken } from './StatusToken.js';
import type { ThenAbilityProperties } from './ThenAbility.js';
import type Player from './Player.js';
import type { MessageArgs } from './GameChat.js';

interface BaseTarget {
    activePromptTitle?: string;
    location?: Location | Location[];
    controller?: ((context: AbilityContext) => Players) | Players;
    player?: ((context: AbilityContext) => Players.Self | Players.Opponent) | Players.Self | Players.Opponent;
    hideIfNoLegalTargets?: boolean;
    gameAction?: GameAction | GameAction[];
    source?: EffectSource | string;
    buttons?: { text: string; arg: string }[];
}

export interface ChoicesInterface {
    [propName: string]: ((context: AbilityContext) => unknown) | GameAction | GameAction[];
}

/** An `undefined` choice is left out: branches returning different choices get each other's labels as `?: undefined`. */
export interface ChoicesInput {
    [propName: string]: ChoicesInterface[string] | undefined;
}

export interface TargetSelect extends BaseTarget {
    mode: TargetMode.Select;
    choices: ChoicesInput | ((context: AbilityContext) => ChoicesInput);
    condition?: (context: AbilityContext) => boolean;
    targets?: boolean;
}

export interface TargetRing extends BaseTarget {
    mode: TargetMode.Ring;
    optional?: boolean;
    ringCondition: (ring: Ring, context: AbilityContext) => boolean;
}

export interface TargetAbility extends BaseTarget {
    mode: TargetMode.Ability;
    cardType?: CardType | CardType[];
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    abilityCondition?: (ability: CardAbility) => boolean;
}

export interface TargetToken extends BaseTarget {
    mode: TargetMode.Token;
    optional?: boolean;
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    tokenCondition?: (token: StatusToken, context: AbilityContext) => boolean;
}

export interface TargetElementSymbol extends BaseTarget {
    mode: TargetMode.ElementSymbol;
    location?: Location | Location[];
    cardType?: CardType | CardType[];
}

interface BaseTargetCard extends BaseTarget {
    cardType?: CardType | CardType[];
    location?: Location | Location[];
    optional?: boolean;
}

export interface TargetCardExactlyUpTo extends BaseTargetCard {
    mode: TargetMode.Exactly | TargetMode.UpTo;
    numCards: number;
    sameDiscardPile?: boolean;
}

export interface TargetCardExactlyUpToVariable extends BaseTargetCard {
    mode: TargetMode.ExactlyVariable | TargetMode.UpToVariable;
    numCardsFunc: (context: AbilityContext) => number;
}

export interface TargetCardMaxStat extends BaseTargetCard {
    mode: TargetMode.MaxStat;
    numCards: number;
    cardStat: (card: DrawCard) => number;
    maxStat: () => number;
}

export interface TargetCardSingleUnlimited extends BaseTargetCard {
    mode?: TargetMode.Single | TargetMode.Unlimited;
}

type TargetCard =
    | TargetCardExactlyUpTo
    | TargetCardExactlyUpToVariable
    | TargetCardMaxStat
    | TargetCardSingleUnlimited
    | TargetAbility
    | TargetToken
    | TargetElementSymbol;

export interface SubTarget {
    dependsOn?: string;
}

export interface ActionCardTarget {
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
}

export interface ActionRingTarget {
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
}

type ActionTarget = (TargetCard & ActionCardTarget) | (TargetRing & ActionRingTarget) | TargetSelect | TargetAbility;

interface ActionTargets {
    [propName: string]: ActionTarget & SubTarget;
}

export interface InitiateDuel extends DuelProperties {
    opponentChoosesDuelTarget?: boolean;
    opponentChoosesChallenger?: boolean;
    requiresConflict?: boolean;
    challengerCondition?: (card: DrawCard, context: AbilityContext) => boolean;
    targetCondition?: (card: DrawCard, context: AbilityContext) => boolean;
}

export type EffectArg =
    | number
    | string
    | Player
    | BaseCard
    | DrawCard
    | ProvinceCard
    | Ring
    | StatusToken
    | undefined
    | null
    | { id: string; label: string; name: string; facedown: boolean; type: CardType }
    | EffectArg[];

/**
 * A callback an ability calls with its own context. It's typed through a method, so it's
 * bivariant in its parameters: an ability declared for a narrower source (`AbilityContext<DrawCard>`)
 * can be stored as a plain ability, because the ability only ever calls it with a context whose
 * source is its own card.
 */
export type OwnContextCallback<Args extends unknown[], R> = { callback(...args: Args): R }['callback'];

interface AbilityProps<Context> {
    title: string;
    location?: Location | Location[];
    cost?: Cost | Cost[];
    limit?: AbilityLimit;
    max?: AbilityLimit;
    target?: ActionTarget;
    targets?: ActionTargets;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    cannotBeMirrored?: boolean;
    printedAbility?: boolean;
    cannotTargetFirst?: boolean;
    effect?: string | OwnContextCallback<[context: Context], MessageArgs>;
    evenDuringDynasty?: boolean;
    effectArgs?: EffectArg | OwnContextCallback<[context: Context], EffectArg>;
    gameAction?: NoInfer<DeclaredGameAction<Context> | DeclaredGameAction<Context>[]>;
    handler?: OwnContextCallback<[context: Context], void>;
    then?: ThenAbilityProperties | OwnContextCallback<[context: Context], ThenAbilityProperties | undefined>;
}

export interface ActionProps<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<AbilityContext<Source, Target>> {
    condition?: OwnContextCallback<[context: AbilityContext<Source, Target>], boolean>;
    phase?: Phases | 'any';
    anyPlayer?: boolean;
    conflictProvinceCondition?: OwnContextCallback<[province: ProvinceCard, context: AbilityContext<Source, Target>], boolean>;
    canTriggerOutsideConflict?: boolean;
}

export interface ConflictActionProps<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> extends ActionProps<Source, Target> {
    conflictType?: ConflictType;
    evenFromHome?: boolean;
}

interface TriggeredAbilityCardTarget {
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
}

interface TriggeredAbilityRingTarget {
    ringCondition?: (ring: Ring, context: TriggeredAbilityContext) => boolean;
}

type TriggeredAbilityTarget =
    | (TargetCard & TriggeredAbilityCardTarget)
    | (TargetRing & TriggeredAbilityRingTarget)
    | TargetSelect;

interface TriggeredAbilityTargets {
    [propName: string]: TriggeredAbilityTarget & SubTarget;
}

export type TargetPropertiesInput = (ActionTarget | TriggeredAbilityTarget) & SubTarget;

export type WhenType<Source extends EffectSource = BaseCard> = {
    [Evt in EventName]?: OwnContextCallback<[event: EventPayload<Evt>, context: TriggeredAbilityContext<Source>], unknown>;
};

export interface TriggeredAbilityWhenProps<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<TriggeredAbilityContext<Source, Target>> {
    when: WhenType<Source>;
    collectiveTrigger?: boolean;
    anyPlayer?: boolean;
    condition?: (context: AbilityContext) => boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: OwnContextCallback<[context: TriggeredAbilityContext<Source, Target>], void>;
    then?: ThenAbilityProperties | OwnContextCallback<[context: TriggeredAbilityContext<Source, Target>], ThenAbilityProperties | undefined>;
}

export interface TriggeredAbilityAggregateWhenProps<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<TriggeredAbilityContext<Source, Target>> {
    aggregateWhen: OwnContextCallback<[events: Event[], context: TriggeredAbilityContext<Source, Target, Event[]>], boolean>;
    collectiveTrigger?: boolean;
    condition?: (context: AbilityContext) => boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: OwnContextCallback<[context: TriggeredAbilityContext<Source, Target>], void>;
    then?: ThenAbilityProperties | OwnContextCallback<[context: TriggeredAbilityContext<Source, Target>], ThenAbilityProperties | undefined>;
}

export type TriggeredAbilityProps<Source extends EffectSource = BaseCard, Target extends BaseCard = BaseCard> = TriggeredAbilityWhenProps<Source, Target> | TriggeredAbilityAggregateWhenProps<Source, Target>;

export type TargetLocation = Location | (string & {});

/** A card effect matches the cards in its target location: only draw cards are in play. */
type MatchTarget<T, L extends TargetLocation> = T extends BaseCard ? (L extends Location.PlayArea ? DrawCard : BaseCard) : T;

export interface PersistentEffectProps<Source extends EffectSource = BaseCard, T extends EffectTarget = EffectTarget, L extends TargetLocation = Location.PlayArea> {
    location?: Location;
    condition?: (context: AbilityContext<Source>) => boolean;
    match?: (target: MatchTarget<T, L>, context?: AbilityContext<Source>) => boolean;
    targetController?: Players;
    targetLocation?: L;
    effect: EffectFactory<T> | EffectFactory<T>[];
    createCopies?: boolean;
    /** A keyword's effect (e.g. dire), which survives losing all non-keyword abilities. */
    isKeywordEffect?: boolean;
}

export type traitLimit = {
    [trait: string]: number;
};

export interface AttachmentConditionProps {
    limit?: number;
    myControl?: boolean;
    opponentControlOnly?: boolean;
    unique?: boolean;
    faction?: Faction | Faction[];
    trait?: string | string[];
    limitTrait?: traitLimit | traitLimit[];
    cardCondition?: (card: DrawCard) => boolean;
}
