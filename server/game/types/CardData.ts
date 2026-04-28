export interface CardData {
    id: string;
    name: string;
    type: string;

    faction?: string;
    clan?: string;
    side?: 'conflict' | 'dynasty' | 'province';

    text?: string;
    traits?: string[];
    is_unique?: boolean;

    cost?: string | null;
    military?: string | null;
    political?: string | null;
    glory?: string | null;
    strength_bonus?: string | null;
    military_bonus?: string | null;
    political_bonus?: string | null;

    fate?: number | null;
    honor?: number | null;
    influence_pool?: number | null;

    strength?: number | string | null;
    elements?: string[] | 'all';

    attachment_allow_duplicates?: boolean;

    deck_limit?: number;
    influence_cost?: number | null;
    restricted_in?: string[];
    banned_in?: string[];
    allowed_clans?: string[];
    role_restrictions?: string[];
    pack_id?: string;
}
