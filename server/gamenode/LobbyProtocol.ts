import { z } from 'zod';

export const PROTOCOL_VERSION = 1;

// Inbound (lobby → game node)
export const InboundMessageSchema = z.discriminatedUnion('command', [
    z.object({ command: z.literal('PING'), arg: z.any().optional() }),
    z.object({ command: z.literal('REGISTER'), arg: z.any().optional() }),
    z.object({ command: z.literal('STARTGAME'), arg: z.any() }),
    z.object({
        command: z.literal('SPECTATOR'),
        arg: z.object({ game: z.any(), user: z.any() })
    }),
    z.object({
        command: z.literal('CONNECTFAILED'),
        arg: z.object({ gameId: z.string(), username: z.string() })
    }),
    z.object({
        command: z.literal('CLOSEGAME'),
        arg: z.object({ gameId: z.string() })
    }),
    z.object({ command: z.literal('CARDDATA'), arg: z.any() })
]);
export type InboundMessage = z.infer<typeof InboundMessageSchema>;
export type InboundCommand = InboundMessage['command'];

// Outbound (game node → lobby)
export interface HelloPayload {
    maxGames: number;
    address: string;
    port: number;
    protocol: string;
    version: string;
    protocolVersion: number;
    games: unknown;
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
    game: unknown;
    winner: string;
    reason: string;
}

export interface PlayerLeftPayload {
    gameId: string;
    game: unknown;
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
