import { z } from 'zod';

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
    [key: string]: unknown;
}

export interface DeckDTO {
    _id?: unknown;
    name?: string;
    selected?: boolean;
    status?: unknown;
    faction?: { name?: string; value?: string };
    conflictCards?: unknown[];
    dynastyCards?: unknown[];
    stronghold?: unknown[];
    role?: unknown[];
    provinceCards?: unknown[];
    [key: string]: unknown;
}

export interface PendingPlayerDTO {
    id: string;
    name: string;
    user?: UserIdentity & { settings?: unknown };
    emailHash?: string;
    owner?: boolean;
    left?: boolean;
    disconnected?: boolean;
    deck?: DeckDTO;
    faction?: { name?: string; value?: string };
    agenda?: { cardData?: { code?: string } };
}

export interface PendingSpectatorDTO {
    id: string;
    name: string;
    user?: UserIdentity;
    emailHash?: string;
    settings?: unknown;
}

export interface PendingGameDTO {
    id: string;
    name: string;
    owner: string;
    players: Record<string, PendingPlayerDTO>;
    spectators: Record<string, PendingSpectatorDTO>;
    allowSpectators: boolean;
    spectatorSquelch?: boolean;
    gameType?: string;
    gameMode?: string;
    clocks?: unknown;
    createdAt: Date | string;
    started: boolean;
    node?: { identity?: string } | null;
    password?: string;
    gameChat?: unknown;
}

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
    gameMode: string;
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
    lobbyId?: string;
    left?: boolean;
    name: string;
    owner: boolean;
}

export interface GameSummary {
    allowSpectators: boolean;
    createdAt: Date | string;
    gameType: string;
    id: string;
    manualMode: boolean;
    messages: unknown[];
    name: string;
    owner: string;
    players: Record<string, PlayerSummary>;
    started: boolean;
    startedAt?: Date | string;
    gameMode: string;
    spectators: Array<{ id: string; lobbyId?: string; name: string }>;
    password?: string;
}

// ----- Inbound (lobby → game node) -----

export const InboundMessageSchema = z.discriminatedUnion('command', [
    z.object({ command: z.literal('PING'), arg: z.unknown().optional() }),
    z.object({ command: z.literal('REGISTER'), arg: z.unknown().optional() }),
    z.object({ command: z.literal('STARTGAME'), arg: z.custom<PendingGameDTO>() }),
    z.object({
        command: z.literal('SPECTATOR'),
        arg: z.object({ game: z.custom<PendingGameDTO>(), user: z.custom<UserIdentity>() })
    }),
    z.object({
        command: z.literal('CONNECTFAILED'),
        arg: z.object({ gameId: z.string(), username: z.string() })
    }),
    z.object({
        command: z.literal('CLOSEGAME'),
        arg: z.object({ gameId: z.string() })
    }),
    z.object({ command: z.literal('CARDDATA'), arg: z.unknown() })
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
