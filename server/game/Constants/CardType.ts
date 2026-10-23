export enum CardType {
    Stronghold = 'stronghold',
    Role = 'role',
    Province = 'province',
    Character = 'character',
    Holding = 'holding',
    Event = 'event',
    Attachment = 'attachment',
    Warlord = 'warlord',
    Treaty = 'treaty'
}

/** The types of the cards in a game: no Warlord or Treaty. */
export const ALL_CARD_TYPES: readonly CardType[] = [
    CardType.Stronghold,
    CardType.Role,
    CardType.Province,
    CardType.Character,
    CardType.Holding,
    CardType.Event,
    CardType.Attachment
];
