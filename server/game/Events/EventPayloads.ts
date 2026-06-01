import type { AbilityContext } from '../AbilityContext.js';
import type ActionWindow from '../gamesteps/ActionWindow.js';
import type AttackersMatrix from '../gamesteps/conflict/AttackersMatrix.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type { CharacterStatus, ConflictTypes, Decks, DuelTypes, EventNames, Locations, Phases, Players, TokenTypes } from '../Constants.js';
import type { Direction } from '../GameActions/ModifyBidAction.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import type { Event } from './Event.js';
import type { GameAction } from '../GameActions/GameAction.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
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
    [EventNames.OnCardPlayed]: BaseEventPayload & {
        player: Player;
        card: DrawCard;
        originalLocation?: Locations;
        playType?: string;
    };
    [EventNames.OnConflictDeclared]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictTypes;
        ring?: Ring;
        attackers?: DrawCard[];
        defenders?: DrawCard[];
        ringFate?: number;
    };
    [EventNames.OnConflictDeclaredBeforeProvinceReveal]: BaseEventPayload & {
        conflict: Conflict;
        type?: ConflictTypes;
        ring?: Ring;
        attackers?: DrawCard[];
        ringFate?: number;
    };
    [EventNames.OnTheCrashingWave]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnConflictStarted]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnConflictFinished]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnConflictPass]: BaseEventPayload & { conflict: Conflict; player?: Player };
    [EventNames.OnCharacterEntersPlay]: BaseEventPayload & {
        card: DrawCard;
        player?: Player;
        originalLocation?: Locations;
        fate?: number;
        status?: 'honored' | 'ordinary' | 'dishonored';
        controller?: Players;
        intoConflict?: boolean;
        side?: Player;
    };
    [EventNames.OnCardRevealed]: BaseEventPayload & { card: BaseCard; onDeclaration?: boolean };
    [EventNames.OnBreakProvince]: BaseEventPayload & {
        card: ProvinceCard;
        conflict: Conflict | null;
    };
    [EventNames.OnCardLeavesPlay]: BaseEventPayload & {
        card: BaseCard;
        destination?: Locations;
        cardStateWhenLeftPlay?: BaseCard;
        isSacrifice?: boolean;
        shuffle?: boolean;
        options?: { bottom?: boolean };
    };
    [EventNames.OnCardHonored]: BaseEventPayload & { card: DrawCard; source?: BaseCard };
    [EventNames.OnCardDishonored]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardBowed]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardReadied]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardMoved]: BaseEventPayload & {
        card: BaseCard;
        originalLocation: Locations;
        newLocation: Locations;
        shuffle?: boolean;
        bottom?: boolean;
        options?: { bottom?: boolean };
        amount?: number;
        cards?: BaseCard[];
        player?: Player;
        discardedCards?: BaseCard[];
    };
    [EventNames.OnClaimRing]: BaseEventPayload & {
        player: Player;
        ring: Ring;
        conflict?: Conflict;
    };
    [EventNames.OnPhaseStarted]: BaseEventPayload & { phase: Phases };
    [EventNames.OnPhaseEnded]: BaseEventPayload & { phase: Phases };
    [EventNames.OnInitiateAbilityEffects]: BaseEventPayload & {
        context: AbilityContext;
        card: BaseCard;
        cardTargets?: BaseCard[];
        ringTargets?: Ring[];
    };
    [EventNames.OnMoveToConflict]: BaseEventPayload & { card: DrawCard; side?: Player };
    [EventNames.OnDefendersDeclared]: BaseEventPayload & { conflict: Conflict; defenders?: DrawCard[] };
    [EventNames.OnPassFirstPlayer]: BaseEventPayload & { player?: Player };
    [EventNames.OnPassActionPhasePriority]: BaseEventPayload & {
        player: Player;
        consecutiveActions?: number;
        actionWindow?: ActionWindow;
    };
    [EventNames.OnDeckShuffled]: BaseEventPayload & { player: Player; deck: Decks };
    [EventNames.OnCardAttached]: BaseEventPayload & {
        card: BaseCard;
        parent: DrawCard | Ring;
        originalLocation?: Locations;
    };
    [EventNames.AfterDuel]: BaseEventPayload & {
        duel?: Duel;
        winner?: DrawCard[];
        loser?: DrawCard[];
        winningPlayer?: Player | Player[];
        losingPlayer?: Player | Player[];
    };
    [EventNames.OnDuelFinished]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnAddDuelParticipant]: BaseEventPayload & { card: DrawCard; duel: Duel };
    [EventNames.OnDuelChallenge]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnDuelFocus]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnDuelStrike]: BaseEventPayload & { duel?: Duel };
    [EventNames.AfterConflict]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnMoveFate]: BaseEventPayload & {
        fate: number;
        amount?: number;
        origin?: Ring | BaseCard | Player;
        recipient?: Player | BaseCard | Ring;
        context?: AbilityContext;
    };
    [EventNames.OnSpendFate]: BaseEventPayload & {
        amount: number;
        context: AbilityContext;
        recipient?: Player;
        fate?: number;
    };
    [EventNames.OnFateCollected]: BaseEventPayload & { player: Player };
    [EventNames.OnModifyFate]: BaseEventPayload & {
        player?: Player;
        card?: BaseCard;
        amount?: number;
    };
    [EventNames.OnCardAbilityInitiated]: BaseEventPayload & {
        card: BaseCard;
        ability: BaseAbility;
        context: AbilityContext;
        player?: Player;
    };
    [EventNames.OnCardAbilityTriggered]: BaseEventPayload & {
        player: Player;
        card: BaseCard;
        context: AbilityContext;
        ability?: BaseAbility;
    };
    [EventNames.OnAbilityResolved]: BaseEventPayload & {
        card?: BaseCard;
        context?: AbilityContext;
        ability?: BaseAbility;
    };
    [EventNames.OnReturnHome]: BaseEventPayload & {
        card: DrawCard;
        conflict?: Conflict;
        bowEvent?: Event;
    };
    [EventNames.OnParticipantsReturnHome]: BaseEventPayload & {
        conflict: Conflict;
        returnHomeEvents?: Event[];
    };
    [EventNames.OnCardsDrawn]: BaseEventPayload & {
        player: Player;
        amount: number;
        cards?: DrawCard[];
    };
    [EventNames.OnCardsDiscarded]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        originalCardStateInfo?: { location: Locations; owner: Player }[];
    };
    [EventNames.OnCardsDiscardedFromHand]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        amount?: number;
        reveal?: boolean;
        match?: (context: AbilityContext, card: BaseCard) => boolean;
        discardedAtRandom?: boolean;
        discardedCards?: BaseCard[];
    };
    [EventNames.OnAddTokenToCard]: BaseEventPayload & {
        card: BaseCard;
        token?: StatusToken;
        recipient?: BaseCard;
        tokenType?: TokenTypes;
    };
    [EventNames.OnStatusTokenGained]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken | CharacterStatus;
        recipient?: BaseCard;
    };
    [EventNames.OnStatusTokenMoved]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        donor?: BaseCard;
        recipient?: DrawCard;
    };
    [EventNames.OnStatusTokenDiscarded]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        cards?: BaseCard[];
    };
    [EventNames.OnEffectApplied]: BaseEventPayload & {
        effect?: unknown;
        context?: AbilityContext;
        card?: BaseCard;
        effectTypes?: string[];
        matches?: BaseCard[];
    };
    [EventNames.OnLookAtCards]: BaseEventPayload & {
        player?: Player;
        cards?: BaseCard[];
        stateBeforeResolution?: { card: BaseCard; location: Locations }[];
    };
    [EventNames.OnDeckSearch]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        selectedCards?: BaseCard[];
    };
    [EventNames.OnHonorBid]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        giveHonor?: boolean;
        prohibitedBids?: number[];
        players?: Players;
        postBidAction?: GameAction;
        message?: string;
        messageArgs?: (context: AbilityContext) => unknown[];
    };
    [EventNames.OnModifyBid]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        direction?: Direction;
    };
    [EventNames.OnModifyHonor]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        dueToUnopposed?: boolean;
    };
    [EventNames.OnTransferHonor]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        afterBid?: boolean;
    };
    [EventNames.OnResolveFateCost]: BaseEventPayload & {
        player?: Player;
        amount?: number;
        context?: AbilityContext;
    };
    [EventNames.OnDuelInitiated]: BaseEventPayload & {
        duel?: Duel;
        cards?: DrawCard[];
        duelType?: DuelTypes;
        challenger?: DrawCard;
        duelTarget?: BaseCard | BaseCard[];
    };
    [EventNames.OnDuelStarted]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnDuelResolution]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnCardTainted]: BaseEventPayload & { card?: BaseCard };
    [EventNames.OnCardTurnedFacedown]: BaseEventPayload & { card?: BaseCard };
    [EventNames.OnDynastyCardTurnedFaceup]: BaseEventPayload & { card?: BaseCard };
    [EventNames.OnRevealFacedownDynastyCards]: BaseEventPayload & { player?: Player };
    [EventNames.OnRestoreProvince]: BaseEventPayload & { card?: ProvinceCard };
    [EventNames.OnResolveConflictRing]: BaseEventPayload & {
        ring?: Ring;
        conflict?: Conflict;
        player?: Player;
    };
    [EventNames.OnResolveRingElement]: BaseEventPayload & {
        element?: string;
        player?: Player;
        ring?: Ring;
        effectivellyResolvedEffect?: boolean;
        physicalRing?: Ring;
        optional?: boolean;
    };
    [EventNames.OnRemoveRingFromPlay]: BaseEventPayload & { ring: Ring };
    [EventNames.OnReturnRingToPlay]: BaseEventPayload & { ring: Ring };
    [EventNames.OnReturnRing]: BaseEventPayload & { ring?: Ring };
    [EventNames.OnCovertResolved]: BaseEventPayload & {
        card?: DrawCard;
        target?: DrawCard;
    };
    [EventNames.OnConflictOpportunityAvailable]: BaseEventPayload & {
        player?: Player;
        attackerMatrix?: AttackersMatrix;
        type?: ConflictTypes;
    };
    [EventNames.OnCreateTokenCharacter]: BaseEventPayload & {
        tokenCharacter?: DrawCard;
        card?: DrawCard;
    };
    [EventNames.OnPlaceFateOnUnclaimedRings]: BaseEventPayload & {
        player?: Player;
        recipients?: { ring: Ring; amount: number }[];
    };
    [EventNames.OnBeginRound]: BaseEventPayload & { round?: number };
    [EventNames.OnRoundEnded]: BaseEventPayload & { round?: number };
    [EventNames.OnFavorGloryTied]: BaseEventPayload;
    [EventNames.OnHonorDialsRevealed]: BaseEventPayload & {
        player1?: Player;
        player2?: Player;
        isHonorBid?: boolean;
        duel?: Duel;
    };
    [EventNames.OnPhaseCreated]: BaseEventPayload & { phase?: Phases };
    [EventNames.OnPassDuringDynasty]: BaseEventPayload & { player?: Player; firstToPass?: boolean };
    [EventNames.OnCardDetached]: BaseEventPayload & {
        card?: BaseCard;
        parent?: BaseCard;
    };
    [EventNames.OnSendHome]: BaseEventPayload & { card?: DrawCard };
    [EventNames.OnDiscardFavor]: BaseEventPayload & { player?: Player };
    [EventNames.OnClaimFavor]: BaseEventPayload & { player?: Player };
    [EventNames.OnConflictInitiated]: BaseEventPayload & { player: Player };
    [EventNames.OnConflictMoved]: BaseEventPayload & { card: ProvinceCard };
    [EventNames.OnFlipFavor]: BaseEventPayload & { player: Player };
    [EventNames.OnGloryCount]: BaseEventPayload;
    [EventNames.OnSetHonorDial]: BaseEventPayload & { player: Player; value: number };
    [EventNames.OnSwitchConflictElement]: BaseEventPayload & { ring: Ring };
    [EventNames.OnSwitchConflictType]: BaseEventPayload & { ring: Ring };
    [EventNames.OnTakeRing]: BaseEventPayload & { ring: Ring };
}

export type EventPayload<K extends string> =
    K extends keyof EventPayloadMap ? EventPayloadMap[K] : BaseEventPayload & Record<string, unknown>;

// An event of a specific name, carrying its precise payload fields alongside the
// framework Event surface. Produced by the typed event factory.
export type GameEvent<N extends string = EventNames> = Event & EventPayload<N>;

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
