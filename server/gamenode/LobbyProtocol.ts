import { z } from 'zod';
import { CardDataSchema, type CardData } from '../game/types/CardData.js';
import { lenientArray, lenientRecord } from '../game/utils/schemas.js';
import { ClockType, type ClockConfig } from '../game/Clocks/ClockSelector.js';
import type { GamePlayerUser, GamePlayerUserSettings } from '../game/Player.js';

export const PROTOCOL_VERSION = 1;

// ----- Shared DTOs (wire shapes — both repos must mirror) -----

export interface LobbyUser {
    username: string;
    id?: string;
    emailHash?: string;
    settings?: unknown;
    blockList?: string[];
    [key: string]: unknown;
}

// Minimal user identity carried on the wire — name + gravatar hash, nothing sensitive.
export interface UserIdentity {
    username: string;
    emailHash?: string;
}

export interface ShortCardData {
    id: string;
    name: string;
    type?: string;
    versions?: { pack_id: string }[] | null;
    [key: string]: unknown;
}

/** Parsed record by record, so one bad record doesn't drop the rest. */
export const ShortCardDataSchema: z.ZodType<ShortCardData> = z.looseObject({
    id: z.string(),
    name: z.string(),
    type: z.string().optional().catch(undefined),
    versions: lenientArray(z.looseObject({ pack_id: z.string() })).nullish().catch(null)
});

export interface DeckCardEntry {
    count: number;
    card?: CardData | null;
    pack_id?: string | null;
}

export interface DeckDTO {
    _id?: unknown;
    name?: string;
    selected?: boolean;
    faction?: { name?: string; value?: string };
    conflictCards?: DeckCardEntry[];
    dynastyCards?: DeckCardEntry[];
    stronghold?: DeckCardEntry[];
    role?: DeckCardEntry[];
    provinceCards?: DeckCardEntry[];
    outsideTheGameCards?: CardData[];
}

// The lobby's data is taken as leniently as the engine used to take it: a malformed optional value
// counts as missing, and an invalid entry in a list is dropped instead of failing the game.

// An entry whose card the lobby couldn't find has no `card`; the deck skips it.
const DeckCardEntrySchema: z.ZodType<DeckCardEntry> = z.looseObject({
    count: z.coerce.number().catch(0),
    card: CardDataSchema.nullish().catch(null),
    pack_id: z.string().nullish().catch(null)
});

const deckSection = lenientArray(DeckCardEntrySchema).optional().catch(undefined);

/** A deck as the lobby stores it, with its card data filled in; other fields pass through unchecked. */
export const DeckSchema: z.ZodType<DeckDTO> = z.looseObject({
    name: z.string().optional().catch(undefined),
    selected: z.boolean().optional().catch(undefined),
    faction: z.looseObject({
        name: z.string().optional().catch(undefined),
        value: z.string().optional().catch(undefined)
    }).optional().catch(undefined),
    conflictCards: deckSection,
    dynastyCards: deckSection,
    stronghold: deckSection,
    role: deckSection,
    provinceCards: deckSection,
    outsideTheGameCards: lenientArray(CardDataSchema).optional().catch(undefined)
});

// User settings are stored by the lobby as the client sent them; a malformed value counts as unset.
const UserSettingsSchema: z.ZodType<GamePlayerUserSettings> = z.looseObject({
    cardSize: z.string().optional().catch(undefined),
    disableGravatar: z.boolean().optional().catch(undefined),
    windowTimer: z.union([z.number(), z.string()]).optional().catch(undefined),
    background: z.string().optional().catch(undefined),
    optionSettings: z.record(z.string(), z.boolean()).optional().catch(undefined),
    promptedActionWindows: z.record(z.string(), z.boolean()).optional().catch(undefined),
    timerSettings: z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])).optional().catch(undefined),
    patron: z.looseObject({
        dial: z.string().optional().catch(undefined),
        tokens: z.string().optional().catch(undefined),
        rings: z.string().optional().catch(undefined),
        usePromos: z.boolean().optional().catch(undefined)
    }).optional().catch(undefined)
});

const UserIdentitySchema = z.looseObject({
    username: z.string(),
    emailHash: z.string().optional().catch(undefined)
});

const GamePlayerUserSchema: z.ZodType<GamePlayerUser> = z.looseObject({
    username: z.string(),
    emailHash: z.string().optional().catch(undefined),
    promptedActionWindows: z.record(z.string(), z.boolean()).optional().catch(undefined),
    settings: UserSettingsSchema.optional().catch(undefined)
});

const PendingPlayerSchema = z.looseObject({
    id: z.string().catch(''),
    name: z.string(),
    user: GamePlayerUserSchema,
    deck: DeckSchema.optional().catch(undefined)
});

const PendingSpectatorSchema = z.looseObject({
    id: z.string().catch(''),
    user: UserIdentitySchema
});

const ClockConfigSchema: z.ZodType<ClockConfig> = z.looseObject({
    type: z.enum(ClockType).catch(ClockType.NONE),
    time: z.coerce.number().catch(0),
    periods: z.coerce.number().catch(0),
    timePeriod: z.coerce.number().catch(0)
});

/**
 * The game the lobby hands over in STARTGAME. Only what the node can't create a game without is
 * required: the game's id, name and owner, and each player's name and username.
 */
export const PendingGameSchema = z.looseObject({
    id: z.string(),
    name: z.string(),
    owner: z.string(),
    players: z.record(z.string(), PendingPlayerSchema),
    spectators: lenientRecord(PendingSpectatorSchema).catch({}),
    allowSpectators: z.boolean().catch(false),
    spectatorSquelch: z.boolean().optional().catch(undefined),
    gameType: z.string().optional().catch(undefined),
    gameMode: z.string().optional().catch(undefined),
    clocks: ClockConfigSchema.optional().catch(undefined),
    password: z.string().optional().catch(undefined),
    savedGameId: z.string().optional().catch(undefined)
});
export type PendingGameDTO = z.infer<typeof PendingGameSchema>;

// Save state — produced by Game.getSaveState(); consumed by lobby for stats/persistence.
export interface PlayerSaveState {
    name: string;
    faction: string;
    honor: number;
    lostProvinces: number;
    deck?: unknown;
    deckId?: string;
}

export interface GameSaveState {
    id?: unknown;
    gameId: string;
    startedAt?: Date | string;
    players: PlayerSaveState[];
    winner?: string;
    winReason?: string;
    gameMode?: string;
    finishedAt?: Date | string;
    roundNumber: number;
    initialFirstPlayer?: string | null;
}

// Game summary — produced by Game.getSummary(); shipped in HELLO.games and broadcast events.
export interface PlayerSummary {
    deck: { name?: string; selected?: boolean };
    emailHash?: string;
    faction?: string;
    id: string;
    lobbyId?: string | null;
    left?: boolean;
    name: string;
    owner: boolean;
}

export interface GameSummary {
    allowSpectators: boolean;
    createdAt: Date | string;
    gameType?: string;
    id: string;
    manualMode: boolean;
    messages: unknown[];
    name: string;
    owner: string;
    players: Record<string, PlayerSummary>;
    started: boolean;
    startedAt?: Date | string;
    gameMode?: string;
    spectators: Array<{ id: string; lobbyId?: string; name: string }>;
    password?: string;
}

// ----- Inbound (lobby → game node) -----

export const InboundMessageSchema = z.discriminatedUnion('command', [
    z.object({ command: z.literal('PING'), arg: z.unknown().optional() }),
    z.object({ command: z.literal('REGISTER'), arg: z.unknown().optional() }),
    z.object({ command: z.literal('STARTGAME'), arg: PendingGameSchema }),
    z.object({
        command: z.literal('SPECTATOR'),
        arg: z.object({ game: z.looseObject({ id: z.string() }), user: UserIdentitySchema })
    }),
    z.object({
        command: z.literal('CONNECTFAILED'),
        arg: z.object({ gameId: z.string(), username: z.string() })
    }),
    z.object({
        command: z.literal('CLOSEGAME'),
        arg: z.object({ gameId: z.string() })
    }),
    z.object({
        command: z.literal('CARDDATA'),
        arg: z.looseObject({ titleCardData: z.unknown(), shortCardData: z.array(z.unknown()).catch([]) })
    })
]);
export type InboundMessage = z.infer<typeof InboundMessageSchema>;
export type InboundCommand = InboundMessage['command'];

// ----- Outbound (game node → lobby) -----

export interface HelloPayload {
    maxGames: number;
    address: string;
    port: number;
    protocol: string;
    version: string;
    protocolVersion: number;
    games: GameSummary[];
}

export interface GameErrorPayload {
    gameId: string;
    gameName: string;
    players: string[];
    errorMessage: string;
    errorStack: string | undefined;
    timestamp: string;
    debugData: unknown;
}

export interface GameClosedPayload {
    game: string;
}

export interface GameWinPayload {
    game: GameSaveState;
    winner: string;
    reason: string;
}

export interface PlayerLeftPayload {
    gameId: string;
    game: GameSaveState;
    player: string;
    spectator: boolean;
}

export type OutboundMessage =
    | { command: 'HELLO'; arg: HelloPayload }
    | { command: 'HEARTBEAT' }
    | { command: 'PONG' }
    | { command: 'GAMEERROR'; arg: GameErrorPayload }
    | { command: 'GAMECLOSED'; arg: GameClosedPayload }
    | { command: 'GAMEWIN'; arg: GameWinPayload }
    | { command: 'PLAYERLEFT'; arg: PlayerLeftPayload };

export type OutboundCommand = OutboundMessage['command'];
