/** What a deck search does with the looked-at cards that weren't taken. */
export enum RemainingCards {
    Shuffle = 'shuffle',
    Discard = 'discard',
    /** Back on top, in the same order. */
    Top = 'top',
    TopAnyOrder = 'topAnyOrder',
    BottomRandom = 'bottomRandom'
}
