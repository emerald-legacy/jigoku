import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../basecard.js';
import type { Conflict } from '../conflict.js';
import type { ConflictTypes, Decks, EventNames, Locations, Phases } from '../Constants.js';
import type DrawCard from '../drawcard.js';
import type { Duel } from '../Duel.js';
import type Player from '../player.js';
import type { ProvinceCard } from '../ProvinceCard.js';
import type Ring from '../ring.js';

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
    [EventNames.OnConflictStarted]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnConflictFinished]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnConflictPass]: BaseEventPayload & { conflict: Conflict; player?: Player };
    [EventNames.OnCharacterEntersPlay]: BaseEventPayload & {
        card: DrawCard;
        player?: Player;
        originalLocation?: Locations;
    };
    [EventNames.OnCardRevealed]: BaseEventPayload & { card: BaseCard };
    [EventNames.OnBreakProvince]: BaseEventPayload & {
        card: ProvinceCard;
        conflict: Conflict | null;
    };
    [EventNames.OnCardLeavesPlay]: BaseEventPayload & {
        card: BaseCard;
        destination?: Locations;
        cardStateWhenLeftPlay?: Record<string, unknown>;
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
    [EventNames.OnDefendersDeclared]: BaseEventPayload & { conflict: Conflict };
    [EventNames.OnPassFirstPlayer]: BaseEventPayload & { player?: Player };
    [EventNames.OnDeckShuffled]: BaseEventPayload & { player: Player; deck: Decks };
    [EventNames.OnCardAttached]: BaseEventPayload & { card: BaseCard; parent: DrawCard };
    [EventNames.AfterDuel]: BaseEventPayload & { duel?: Duel };
    [EventNames.OnDuelFinished]: BaseEventPayload & { duel?: Duel };
    [EventNames.AfterConflict]: BaseEventPayload & { conflict: Conflict };
}

export type EventPayload<K extends string> =
    K extends keyof EventPayloadMap ? EventPayloadMap[K] : BaseEventPayload & Record<string, unknown>;
