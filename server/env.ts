import { z } from 'zod';

const parsedEnv = z
    .object({
        DOMAIN: z.string(),
        ENVIRONMENT: z.string(),
        GAME_NODE_CERT_PATH: z.string().optional(),
        GAME_NODE_KEY_PATH: z.string().optional(),
        GAME_NODE_NAME: z.string(),
        GAME_NODE_PROXY_PORT: z.coerce.number().int().optional(),
        GAME_NODE_SOCKET_IO_PORT: z.coerce.number().int(),
        HTTPS: z.string(),
        LOBBY_PORT: z.coerce.number().int(),
        MAX_GAMES: z.coerce.number().int().positive().default(20),
        LOBBY_WS_URL: z.string(),
        NODE_SECRET: z.string().optional(),
        SECRET: z.string(),
        BUILD_VERSION: z.string().optional()
    })
    .safeParse(process.env);

if(!parsedEnv.success) {
    throw Error(`Failed to initialize environment variables: ${parsedEnv.error.message}`);
}

export const domain = parsedEnv.data.DOMAIN;
export const environment = parsedEnv.data.ENVIRONMENT;
export const gameNodeCertPath = parsedEnv.data.GAME_NODE_CERT_PATH;
export const gameNodeKeyPath = parsedEnv.data.GAME_NODE_KEY_PATH;
export const gameNodeName = parsedEnv.data.GAME_NODE_NAME;
export const gameNodeProxyPort = parsedEnv.data.GAME_NODE_PROXY_PORT;
export const gameNodeSocketIoPort = parsedEnv.data.GAME_NODE_SOCKET_IO_PORT;
export const https = parsedEnv.data.HTTPS;
export const lobbyPort = parsedEnv.data.LOBBY_PORT;
export const maxGames = parsedEnv.data.MAX_GAMES;
export const lobbyWsUrl = parsedEnv.data.LOBBY_WS_URL;
export const nodeSecret = parsedEnv.data.NODE_SECRET;
export const secret = parsedEnv.data.SECRET;
export const buildVersion = parsedEnv.data.BUILD_VERSION ?? 'LOCAL';
