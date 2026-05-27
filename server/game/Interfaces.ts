import type { AbilityContext } from './AbilityContext.js';
import type { EventPayload } from './Events/EventPayloads.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type { GameAction } from './GameActions/GameAction.js';
import type Ring from './ring.js';
import type BaseCard from './basecard.js';
import type DrawCard from './drawcard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type CardAbility from './CardAbility.js';
import type { DuelProperties } from './GameActions/DuelAction.js';
import type { Players, TargetModes, CardTypes, Locations, EventNames, Phases } from './Constants.js';
import type { StatusToken } from './StatusToken.js';
import type Player from './player.js';

interface BaseTarget {
    activePromptTitle?: string;
    location?: Locations | Locations[];
    controller?: ((context: AbilityContext) => Players) | Players;
    player?: ((context: AbilityContext) => Players) | Players;
    hideIfNoLegalTargets?: boolean;
    gameAction?: GameAction | GameAction[];
}

interface ChoicesInterface {
    [propName: string]: ((context: AbilityContext) => boolean) | GameAction | GameAction[];
}

interface TargetSelect extends BaseTarget {
    mode: TargetModes.Select;
    choices: (ChoicesInterface | Record<string, never>) | ((context: AbilityContext) => ChoicesInterface | Record<string, never>);
    condition?: (context: AbilityContext) => boolean;
    targets?: boolean;
}

interface TargetRing extends BaseTarget {
    mode: TargetModes.Ring;
    optional?: boolean;
    ringCondition: (ring: Ring, context?: AbilityContext) => boolean;
}

interface TargetAbility extends BaseTarget {
    mode: TargetModes.Ability;
    cardType?: CardTypes | CardTypes[];
    cardCondition?: (card: any, context?: any) => boolean;
    abilityCondition?: (ability: CardAbility) => boolean;
}

interface TargetToken extends BaseTarget {
    mode: TargetModes.Token;
    optional?: boolean;
    location?: Locations | Locations[];
    cardType?: CardTypes | CardTypes[];
    singleToken?: boolean;
    cardCondition?: (card: any, context?: any) => boolean;
    tokenCondition?: (token: StatusToken, context?: any) => boolean;
}

interface TargetElementSymbol extends BaseTarget {
    mode: TargetModes.ElementSymbol;
    location?: Locations | Locations[];
    cardType?: CardTypes | CardTypes[];
}

interface BaseTargetCard extends BaseTarget {
    cardType?: CardTypes | CardTypes[];
    location?: Locations | Locations[];
    optional?: boolean;
}

interface TargetCardExactlyUpTo extends BaseTargetCard {
    mode: TargetModes.Exactly | TargetModes.UpTo;
    numCards: number;
    sameDiscardPile?: boolean;
}

interface TargetCardExactlyUpToVariable extends BaseTargetCard {
    mode: TargetModes.ExactlyVariable | TargetModes.UpToVariable;
    numCardsFunc: (context: AbilityContext) => number;
}

interface TargetCardMaxStat extends BaseTargetCard {
    mode: TargetModes.MaxStat;
    numCards: number;
    cardStat: (card: BaseCard) => number;
    maxStat: () => number;
}

interface TargetCardSingleUnlimited extends BaseTargetCard {
    mode?: TargetModes.Single | TargetModes.Unlimited;
}

type TargetCard =
    | TargetCardExactlyUpTo
    | TargetCardExactlyUpToVariable
    | TargetCardMaxStat
    | TargetCardSingleUnlimited
    | TargetAbility
    | TargetToken
    | TargetElementSymbol;

interface SubTarget {
    dependsOn?: string;
}

interface ActionCardTarget {
    cardCondition?: (card: any, context?: any) => boolean;
}

interface ActionRingTarget {
    ringCondition?: (ring: Ring, context?: AbilityContext) => boolean;
}

type ActionTarget = (TargetCard & ActionCardTarget) | (TargetRing & ActionRingTarget) | TargetSelect | TargetAbility;

interface ActionTargets {
    [propName: string]: ActionTarget & SubTarget;
}

export interface InitiateDuel extends DuelProperties {
    opponentChoosesDuelTarget?: boolean;
    opponentChoosesChallenger?: boolean;
    requiresConflict?: boolean;
    challengerCondition?: (card: DrawCard, context: TriggeredAbilityContext) => boolean;
    targetCondition?: (card: DrawCard, context: TriggeredAbilityContext) => boolean;
}

type EffectArg =
    | number
    | string
    | Player
    | BaseCard
    | DrawCard
    | ProvinceCard
    | Ring
    | StatusToken
    | { id: string; label: string; name: string; facedown: boolean; type: CardTypes }
    | EffectArg[];

interface AbilityProps<Context> {
    title: string;
    location?: Locations | Locations[];
    cost?: any;
    limit?: any;
    max?: any;
    target?: ActionTarget;
    targets?: ActionTargets;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    cannotBeMirrored?: boolean;
    printedAbility?: boolean;
    cannotTargetFirst?: boolean;
    effect?: string;
    evenDuringDynasty?: boolean;
    effectArgs?: EffectArg | ((context: Context) => EffectArg);
    gameAction?: GameAction | GameAction[];
    handler?: (context?: Context) => void;
    then?: ((context?: AbilityContext) => object) | object;
}

export interface ActionProps<Source = any> extends AbilityProps<AbilityContext<Source>> {
    condition?: (context?: any) => boolean;
    phase?: Phases | 'any';
    emeraldWorksInDynsty?: boolean;
    /**
     * @deprecated
     */
    anyPlayer?: boolean;
    conflictProvinceCondition?: (province: ProvinceCard, context: AbilityContext<Source>) => boolean;
    canTriggerOutsideConflict?: boolean;
}

interface TriggeredAbilityCardTarget {
    cardCondition?: (card: any, context?: any) => boolean;
}

interface TriggeredAbilityRingTarget {
    ringCondition?: (ring: Ring, context?: TriggeredAbilityContext) => boolean;
}

type TriggeredAbilityTarget =
    | (TargetCard & TriggeredAbilityCardTarget)
    | (TargetRing & TriggeredAbilityRingTarget)
    | TargetSelect;

interface TriggeredAbilityTargets {
    [propName: string]: TriggeredAbilityTarget & SubTarget & TriggeredAbilityTarget;
}

export type WhenType = {
    [EventName in EventNames]?: (event: EventPayload<EventName>, context: TriggeredAbilityContext) => unknown;
};

export interface TriggeredAbilityWhenProps extends AbilityProps<TriggeredAbilityContext> {
    when: WhenType;
    collectiveTrigger?: boolean;
    anyPlayer?: boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: (context?: TriggeredAbilityContext) => void;
    then?: ((context?: TriggeredAbilityContext) => object) | object;
}

export interface TriggeredAbilityAggregateWhenProps extends AbilityProps<TriggeredAbilityContext> {
    aggregateWhen: (events: any[], context: TriggeredAbilityContext) => boolean;
    collectiveTrigger?: boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: (context?: TriggeredAbilityContext) => void;
    then?: ((context?: TriggeredAbilityContext) => object) | object;
}

export type TriggeredAbilityProps = TriggeredAbilityWhenProps | TriggeredAbilityAggregateWhenProps;

export interface PersistentEffectProps<Source = any> {
    location?: Locations | Locations[];
    condition?: (context: AbilityContext<Source>) => boolean;
    match?: (card: any, context?: AbilityContext<Source>) => boolean;
    targetController?: Players;
    targetLocation?: Locations | (string & {});
    effect: ((...args: any[]) => any) | ((...args: any[]) => any)[];
    createCopies?: boolean;
}

export type traitLimit = {
    [trait: string]: number;
};

export interface AttachmentConditionProps {
    limit?: number;
    myControl?: boolean;
    opponentControlOnly?: boolean;
    unique?: boolean;
    faction?: string | string[];
    trait?: string | string[];
    limitTrait?: traitLimit | traitLimit[];
    cardCondition?: (card: any) => boolean;
}

interface HonoredToken {
    honored: true;
    card: DrawCard;
    type: 'token';
}

interface DishonoredToken {
    dishonored: true;
    card: DrawCard;
    type: 'token';
}

export type Token = HonoredToken | DishonoredToken;
