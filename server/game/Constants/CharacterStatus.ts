export enum CharacterStatus {
    Honored = 'honored',
    Dishonored = 'dishonored',
    Tainted = 'tainted'
}

/** The status a character enters play with: honored, dishonored, or neither. */
export type EntersPlayStatus = `${CharacterStatus.Honored}` | `${CharacterStatus.Dishonored}` | 'ordinary';
