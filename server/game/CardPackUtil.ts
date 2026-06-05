import { GameModes } from '../GameModes.js';

const communityFormats = new Set([GameModes.Emerald, GameModes.Sanctuary, GameModes.Obsidian]);

/**
 * Pick the preferred pack_id from a card's versions array based on game format.
 * Community formats prefer the latest version (EL printing).
 * Imperial formats prefer the first version (FFG printing).
 * If an explicit packId is provided, it takes priority.
 */
export function resolvePackId(packId: string | undefined, card: { versions?: { pack_id: string }[]; [key: string]: unknown } | null | undefined, gameMode: string): string | undefined {
    if(packId) {
        return packId;
    }
    const versions = card?.versions;
    if(versions && versions.length > 0) {
        if(communityFormats.has(gameMode as GameModes)) {
            return versions[versions.length - 1].pack_id;
        }
        return versions[0].pack_id;
    }
    return undefined;
}
