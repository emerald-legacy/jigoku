export enum Location {
    Any = 'any',
    Hand = 'hand',
    ConflictDeck = 'conflict deck',
    DynastyDeck = 'dynasty deck',
    ConflictDiscardPile = 'conflict discard pile',
    DynastyDiscardPile = 'dynasty discard pile',
    PlayArea = 'play area',
    Provinces = 'province',
    ProvinceOne = 'province 1',
    ProvinceTwo = 'province 2',
    ProvinceThree = 'province 3',
    ProvinceFour = 'province 4',
    StrongholdProvince = 'stronghold province',
    ProvinceDeck = 'province deck',
    RemovedFromGame = 'removed from game',
    UnderneathStronghold = 'underneath stronghold',
    /** Underneath another card (`card.host`): in the pile kept under that card's uuid. */
    Underneath = 'underneath',
    OutsideTheGame = 'outside the game',
    BeingPlayed = 'being played',
    Role = 'role'
}
