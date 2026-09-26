import { z } from 'zod';
import { Element } from '../Constants.js';
import { lenientArray } from '../utils/schemas.js';

export interface CardData {
    id: string;
    name: string;
    type: string;

    faction?: string | null;
    clan?: string | null;
    side?: string | null;

    text?: string | null;
    traits?: string[] | null;
    is_unique?: boolean | null;

    cost?: string | null;
    military?: string | null;
    political?: string | null;
    glory?: number | string | null;
    strength_bonus?: string | null;
    military_bonus?: string | null;
    political_bonus?: string | null;

    fate?: number | null;
    honor?: number | null;
    influence_pool?: number | null;

    strength?: number | string | null;
    elements?: Element[] | 'all' | null;

    attachment_allow_duplicates?: boolean | null;

    versions?: { pack_id: string }[] | null;
}

/** Optional card data: a malformed value counts as missing rather than failing the card. */
const optional = <T>(schema: z.ZodType<T>) => schema.nullish().catch(null);

/** Card data as the lobby sends it: only id, name and type are required; fields the engine doesn't read pass through unchecked. */
export const CardDataSchema: z.ZodType<CardData> = z.looseObject({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    faction: optional(z.string()),
    clan: optional(z.string()),
    side: optional(z.string()),
    text: optional(z.string()),
    traits: optional(lenientArray(z.string())),
    is_unique: optional(z.boolean()),
    cost: optional(z.string()),
    military: optional(z.string()),
    political: optional(z.string()),
    glory: optional(z.union([z.number(), z.string()])),
    strength_bonus: optional(z.string()),
    military_bonus: optional(z.string()),
    political_bonus: optional(z.string()),
    fate: optional(z.number()),
    honor: optional(z.number()),
    influence_pool: optional(z.number()),
    strength: optional(z.union([z.number(), z.string()])),
    elements: optional(z.union([lenientArray(z.enum(Element)), z.literal('all')])),
    attachment_allow_duplicates: optional(z.boolean()),
    versions: optional(lenientArray(z.looseObject({ pack_id: z.string() })))
});
