const FACTIONS = ['neutral', 'crab', 'crane', 'dragon', 'lion', 'phoenix', 'scorpion', 'unicorn', 'shadowlands'] as const;
export type Faction = typeof FACTIONS[number];

/** Whether a faction read from card or deck data is one of the known ones. */
export function isFactionName(value: string | null | undefined): value is Faction {
    return FACTIONS.some((faction) => faction === value);
}
