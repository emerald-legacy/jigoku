import type { AbilityContext } from '../AbilityContext.js';
import type ActionWindow from '../gamesteps/ActionWindow.js';
import type AttackersMatrix from '../gamesteps/conflict/AttackersMatrix.js';
import type BaseAbility from '../BaseAbility.js';
import type AbilityResolver from '../gamesteps/AbilityResolver.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type { CharacterStatus, ConflictType, Decks, DuelType, EventName, Location, Phases, Players, PlayType, TokenType } from '../Constants.js';
import type { Direction } from '../GameActions/ModifyBidAction.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import type { EffectMatch } from '../Effects/Effect.js';
import type { Event } from './Event.js';
import type { MsgArg } from '../GameChat.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type { StrongholdCard } from '../StrongholdCard.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';

export interface BaseEventPayload {
    name?: string;
    cancelled?: boolean;
    resolved?: boolean;
    context?: AbilityContext;
    cannotBeCancelled?: boolean;
}

export interface EventPayloadMap {
    /** Carries whatever the action that raised it set: a card, player or ring action's target. */
    [EventName.Unnamed]: BaseEventPayload & {
        card?: BaseCard;
        player?: Player;
        ring?: Ring;
        cardStateWhenMoved?: DrawCard;
        postBidAction?: GameAction;
        message?: string;
        messageArgs?: (context: AbilityContext) => MsgArg[];
        duel?: Duel | null;
        isHonorBid?: boolean;
    };
    [EventName.OnCardPlayed]: BaseEventPayload & {
        player: Player;
        card: DrawCard;
        /** A location, or the uuid of the card whose pile it was played from (Back-Alley Hideaway). */
        originalLocation?: Location | string;
        originallyOnTopOfConflictDeck?: boolean;
        playType?: PlayType;
        onPlayCardSource?: BaseCard;
        resolver?: AbilityResolver;
    };
    [EventName.OnAbilityResolverInitiated]: BaseEventPayload & {
        card?: BaseCard;
        player?: Player;
    };
    [EventName.OnReplaceDuelParticipant]: BaseEventPayload;
    [EventName.PayCost]: BaseEventPayload;
    [EventName.OnConflictDeclared]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictType;
        ring?: Ring;
        attackers?: DrawCard[];
        ringFate?: number;
    };
    [EventName.OnConflictDeclaredBeforeProvinceReveal]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictType;
        ring?: Ring;
        attackers: DrawCard[];
        ringFate?: number;
    };
    [EventName.OnTheCrashingWave]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictStarted]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictFinished]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnConflictPass]: BaseEventPayload & { conflict: Conflict };
    [EventName.OnCharacterEntersPlay]: BaseEventPayload & {
        card: DrawCard;
        originalLocation: Location;
        fate?: number;
        status?: 'honored' | 'ordinary' | 'dishonored';
        controller?: Players;
        intoConflict: boolean;
        side: Player;
    };
    [EventName.OnCardRevealed]: BaseEventPayload & { card: BaseCard; onDeclaration?: boolean };
    [EventName.OnBreakProvince]: BaseEventPayload & {
        card: ProvinceCard;
        conflict: Conflict | null;
    };
    [EventName.OnCardLeavesPlay]: BaseEventPayload & {
        card: DrawCard;
        destination?: Location;
        cardStateWhenLeftPlay?: DrawCard;
        cardStateWhenMoved?: DrawCard;
        isSacrifice?: boolean;
        shuffle?: boolean;
        options?: { bottom?: boolean };
    };
    [EventName.OnCardHonored]: BaseEventPayload & { card: DrawCard };
    [EventName.OnCardDishonored]: BaseEventPayload & { card: DrawCard | ProvinceCard };
    [EventName.OnCardBowed]: BaseEventPayload & { card: DrawCard | StrongholdCard };
    [EventName.OnCardReadied]: BaseEventPayload & { card: DrawCard | StrongholdCard };
    /** A card moving between piles, or a player returning cards from hand to their deck. */
    [EventName.OnCardMoved]: BaseEventPayload & {
        card?: BaseCard;
        originalLocation?: Location;
        newLocation?: Location;
        player?: Player;
        cards?: BaseCard[];
        amount?: number;
        shuffle?: boolean;
        bottom?: boolean;
        options?: { bottom?: boolean };
        discardedCards?: BaseCard[];
    };
    [EventName.OnClaimRing]: BaseEventPayload & {
        player: Player;
        ring: Ring;
        conflict?: Conflict;
    };
    [EventName.OnPhaseStarted]: BaseEventPayload & { phase: Phases | 'setup' };
    [EventName.OnPhaseEnded]: BaseEventPayload & { phase: Phases | 'setup' };
    [EventName.OnInitiateAbilityEffects]: BaseEventPayload & {
        context: AbilityContext;
        card: BaseCard;
        cardTargets: BaseCard[];
        ringTargets: Ring[];
    };
    [EventName.OnMoveToConflict]: BaseEventPayload & { card: DrawCard; side: Player };
    [EventName.OnDefendersDeclared]: BaseEventPayload & { conflict: Conflict; defenders: DrawCard[] };
    [EventName.OnPassFirstPlayer]: BaseEventPayload & { player: Player };
    [EventName.OnPassActionPhasePriority]: BaseEventPayload & {
        player: Player;
        consecutiveActions: number;
        actionWindow: ActionWindow;
    };
    [EventName.OnDeckShuffled]: BaseEventPayload & { player: Player; deck: Decks };
    [EventName.OnCardAttached]: BaseEventPayload & {
        card: DrawCard;
        parent: BaseCard | Ring;
        originalLocation?: Location;
    };
    [EventName.AfterDuel]: BaseEventPayload & {
        duel: Duel;
        winner?: DrawCard[];
        loser?: DrawCard[];
        winningPlayer?: Player | Player[];
        losingPlayer?: Player | Player[];
    };
    [EventName.OnDuelFinished]: BaseEventPayload & { duel: Duel };
    [EventName.OnAddDuelParticipant]: BaseEventPayload & { card: DrawCard; duel: Duel };
    [EventName.OnDuelChallenge]: BaseEventPayload & { duel: Duel };
    [EventName.OnDuelFocus]: BaseEventPayload & { duel: Duel; isHonorBid?: boolean };
    [EventName.OnDuelStrike]: BaseEventPayload & { duel: Duel };
    [EventName.AfterConflict]: BaseEventPayload & { conflict: Conflict };
    /** Paying a fate cost to the opponent names only the `amount`; every other move has a `fate`. */
    [EventName.OnMoveFate]: BaseEventPayload & {
        fate?: number;
        amount?: number;
        origin?: Ring | DrawCard | Player;
        recipient?: Player | DrawCard | Ring;
        context?: AbilityContext;
    };
    [EventName.OnSpendFate]: BaseEventPayload & {
        amount: number;
        context: AbilityContext;
    };
    [EventName.OnFateCollected]: BaseEventPayload & { player: Player };
    [EventName.OnModifyFate]: BaseEventPayload & {
        player: Player;
        amount: number;
    };
    [EventName.OnCardAbilityInitiated]: BaseEventPayload & {
        card: BaseCard;
        ability: BaseAbility;
        context: AbilityContext;
    };
    [EventName.OnCardAbilityTriggered]: BaseEventPayload & {
        player: Player;
        card: BaseCard;
        context: AbilityContext;
    };
    [EventName.OnAbilityResolved]: BaseEventPayload;
    [EventName.OnReturnHome]: BaseEventPayload & {
        card: DrawCard;
        conflict: Conflict;
        bowEvent: Event;
    };
    [EventName.OnParticipantsReturnHome]: BaseEventPayload & {
        conflict: Conflict;
        returnHomeEvents: Event[];
    };
    [EventName.OnCardsDrawn]: BaseEventPayload & {
        player: Player;
        amount: number;
    };
    [EventName.OnCardsDiscarded]: BaseEventPayload & {
        cards: DrawCard[];
        originalCardStateInfo: { location: Location; owner: Player }[];
    };
    [EventName.OnCardsDiscardedFromHand]: BaseEventPayload & {
        player: Player;
        cards?: BaseCard[];
        amount?: number;
        reveal?: boolean;
        match?: (context: AbilityContext, card: BaseCard) => boolean;
        discardedAtRandom?: boolean;
        discardedCards?: BaseCard[];
    };
    [EventName.OnAddTokenToCard]: BaseEventPayload & {
        card: BaseCard;
        tokenType?: TokenType;
    };
    [EventName.OnStatusTokenGained]: BaseEventPayload & {
        card: BaseCard;
        token?: StatusToken | CharacterStatus;
    };
    [EventName.OnStatusTokenMoved]: BaseEventPayload & {
        token: StatusToken;
        donor?: BaseCard;
        recipient: DrawCard;
    };
    [EventName.OnStatusTokenDiscarded]: BaseEventPayload & {
        token: StatusToken;
        cards: BaseCard[];
    };
    [EventName.OnEffectApplied]: BaseEventPayload & {
        card?: BaseCard;
        ring?: Ring;
        effectTypes?: string[];
        matches?: EffectMatch[];
    };
    [EventName.OnLookAtCards]: BaseEventPayload & {
        cards: BaseCard[];
        stateBeforeResolution: { card: BaseCard; location: Location }[];
    };
    [EventName.OnDeckSearch]: BaseEventPayload & {
        player: Player;
        amount: number;
        selectedCards?: DrawCard[];
    };
    [EventName.OnHonorBid]: BaseEventPayload & {
        player: Player;
        giveHonor?: boolean;
        prohibitedBids?: number[];
        players?: Players;
        postBidAction?: GameAction;
        message?: string;
        messageArgs?: (context: AbilityContext) => MsgArg[];
    };
    [EventName.OnModifyBid]: BaseEventPayload & {
        player: Player;
        amount: number;
        direction?: Direction;
    };
    [EventName.OnModifyHonor]: BaseEventPayload & {
        player: Player;
        amount: number;
        dueToUnopposed?: boolean;
        dueToStatusToken?: boolean;
    };
    [EventName.OnTransferHonor]: BaseEventPayload & {
        player: Player;
        amount: number;
        afterBid?: boolean;
    };
    [EventName.OnResolveFateCost]: BaseEventPayload;
    [EventName.OnDuelInitiated]: BaseEventPayload & {
        duel: Duel;
        cards: DrawCard[];
        duelType: DuelType;
        challenger: DrawCard;
        duelTarget: BaseCard | BaseCard[] | undefined;
    };
    [EventName.OnDuelStarted]: BaseEventPayload & { duel: Duel };
    [EventName.OnDuelResolution]: BaseEventPayload & { duel: Duel };
    [EventName.OnCardTainted]: BaseEventPayload & { card: BaseCard };
    [EventName.OnCardTurnedFacedown]: BaseEventPayload & { card: BaseCard };
    [EventName.OnDynastyCardTurnedFaceup]: BaseEventPayload;
    [EventName.OnRevealFacedownDynastyCards]: BaseEventPayload & { allRevealedCards: Set<DrawCard> };
    [EventName.OnRestoreProvince]: BaseEventPayload & { card: ProvinceCard };
    [EventName.OnResolveConflictRing]: BaseEventPayload & {
        ring: Ring;
        conflict?: Conflict;
        player: Player;
    };
    [EventName.OnResolveRingElement]: BaseEventPayload & {
        player: Player;
        ring: Ring;
        effectivellyResolvedEffect: boolean;
        physicalRing?: Ring;
        optional?: boolean;
    };
    [EventName.OnRemoveRingFromPlay]: BaseEventPayload & { ring: Ring };
    [EventName.OnReturnRingToPlay]: BaseEventPayload & { ring: Ring };
    [EventName.OnReturnRing]: BaseEventPayload & { ring: Ring };
    /** In Emerald games a single event names every card that used Covert. */
    [EventName.OnCovertResolved]: BaseEventPayload & {
        card: BaseCard | BaseCard[];
    };
    [EventName.OnConflictOpportunityAvailable]: BaseEventPayload & {
        player: Player;
        attackerMatrix: AttackersMatrix;
        type?: ConflictType;
    };
    [EventName.OnCreateTokenCharacter]: BaseEventPayload & {
        tokenCharacter?: DrawCard;
        card: DrawCard;
    };
    [EventName.OnPlaceFateOnUnclaimedRings]: BaseEventPayload & {
        recipients: { ring: Ring; amount: number }[];
    };
    [EventName.OnBeginRound]: BaseEventPayload;
    [EventName.OnRoundEnded]: BaseEventPayload;
    [EventName.OnFavorGloryTied]: BaseEventPayload;
    [EventName.OnHonorDialsRevealed]: BaseEventPayload & {
        isHonorBid: boolean;
        duel: Duel | null;
    };
    [EventName.OnPhaseCreated]: BaseEventPayload & { phase: Phases | 'setup' };
    [EventName.OnPassDuringDynasty]: BaseEventPayload & { player: Player; firstToPass: boolean };
    [EventName.OnCardDetached]: BaseEventPayload & { card: DrawCard };
    [EventName.OnSendHome]: BaseEventPayload & { card: DrawCard };
    [EventName.OnDiscardFavor]: BaseEventPayload & { player: Player };
    [EventName.OnClaimFavor]: BaseEventPayload & { player: Player };
    [EventName.OnConflictInitiated]: BaseEventPayload & { player: Player };
    [EventName.OnConflictMoved]: BaseEventPayload & { card: ProvinceCard };
    [EventName.OnFlipFavor]: BaseEventPayload & { player: Player };
    [EventName.OnGloryCount]: BaseEventPayload;
    [EventName.OnSetHonorDial]: BaseEventPayload & { player: Player; value: number };
    [EventName.OnSwitchConflictElement]: BaseEventPayload & { ring: Ring };
    [EventName.OnSwitchConflictType]: BaseEventPayload & { ring: Ring };
    [EventName.OnTakeRing]: BaseEventPayload & { ring: Ring };
}

/** What an emitter passes for an event: the keys the event manages itself are ruled out. */
export type EventParams<N extends EventName> = EventPayload<N> & {
    cancelled?: never;
    resolved?: never;
    handler?: never;
    window?: never;
};

export type EventPayload<K extends string> =
    K extends keyof EventPayloadMap ? EventPayloadMap[K] : BaseEventPayload & Record<string, unknown>;

// An event of a specific name, carrying its precise payload fields alongside the
// framework Event surface. Produced by the typed event factory. The payload comes first so that
// its narrower `card` wins over `Event.card` when their methods differ (`createSnapshot`).
export type GameEvent<N extends string = EventName> = EventPayload<N> & Event;

export type AllPayloadKeys = EventPayloadMap[keyof EventPayloadMap] extends infer P
    ? P extends object ? keyof P : never
    : never;

// The union of every value `K` can take across all payloads — used to type the
// fallback fields declared on the Event class.
export type PayloadValueAt<K extends PropertyKey> = EventPayloadMap[keyof EventPayloadMap] extends infer P
    ? P extends object ? (K extends keyof P ? P[K] : never) : never
    : never;

// All-fields-optional view, for typing an event whose specific name is not known
// at the use site (e.g. the triggering event on a TriggeredAbilityContext).
export type EventUnion = {
    [K in AllPayloadKeys]?: PayloadValueAt<K>;
};
