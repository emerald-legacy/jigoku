import type { AbilityContext } from '../AbilityContext.js';
import type BaseAbility from '../BaseAbility.js';
import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type { ConflictTypes, Decks, EventNames, Locations, Phases } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type { Duel } from '../Duel.js';
import type { Event } from './Event.js';
import type Player from '../Player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type Ring from '../Ring.js';
import type { StatusToken } from '../StatusToken.js';

export interface BaseEventPayload {
    name?: string;
    cancelled?: boolean;
    resolved?: boolean;
    context?: AbilityContext;
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
    };
    [EventNames.OnCardHonored]: BaseEventPayload & { card: DrawCard; source?: BaseCard };
    [EventNames.OnCardDishonored]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardBowed]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardReadied]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnCardMoved]: BaseEventPayload & {
        card: BaseCard;
        originalLocation: Locations;
        newLocation: Locations;
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
    [EventNames.OnMoveToConflict]: BaseEventPayload & { card: DrawCard };
    [EventNames.OnDefendersDeclared]: BaseEventPayload & { conflict: Conflict; defenders?: DrawCard[] };
    [EventNames.OnPassFirstPlayer]: BaseEventPayload & { player?: Player };
    [EventNames.OnDeckShuffled]: BaseEventPayload & { player: Player; deck: Decks };
    [EventNames.OnCardAttached]: BaseEventPayload & {
        card: BaseCard;
        parent: DrawCard;
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
    };
    [EventNames.OnAddTokenToCard]: BaseEventPayload & {
        card: BaseCard;
        token?: StatusToken;
        recipient?: BaseCard;
    };
    [EventNames.OnStatusTokenGained]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        recipient?: BaseCard;
    };
    [EventNames.OnStatusTokenMoved]: BaseEventPayload & {
        card?: BaseCard;
        token?: StatusToken;
        donor?: BaseCard;
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
    };
    [EventNames.OnModifyBid]: BaseEventPayload & {
        player?: Player;
        amount?: number;
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
    [EventNames.OnDuelInitiated]: BaseEventPayload & { duel?: Duel };
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
    };
    [EventNames.OnResolveRingElement]: BaseEventPayload & {
        element?: string;
        player?: Player;
        ring?: Ring;
        effectivellyResolvedEffect?: boolean;
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
    };
    [EventNames.OnCreateTokenCharacter]: BaseEventPayload & {
        tokenCharacter?: DrawCard;
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
}

export type EventPayload<K extends string> =
    K extends keyof EventPayloadMap ? EventPayloadMap[K] : BaseEventPayload & Record<string, unknown>;
