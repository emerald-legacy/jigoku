export enum AbilityType {
    Action = 'action',
    WouldInterrupt = 'wouldInterrupt',
    ForcedInterrupt = 'forcedInterrupt',
    KeywordInterrupt = 'keywordInterrupt',
    Interrupt = 'interrupt',
    KeywordReaction = 'keywordReaction',
    ForcedReaction = 'forcedReaction',
    Reaction = 'reaction',
    DuelReaction = 'duelReaction', // ONLY USE FOR DUEL CHALLENGE, FOCUS, AND STRIKE
    Persistent = 'persistent',
    OtherEffects = 'otherEffects'
}

/** The triggered abilities a card offers in trigger windows (not keyword ones). */
export const TRIGGERED_ABILITY_TYPES: ReadonlySet<AbilityType> = new Set([
    AbilityType.DuelReaction,
    AbilityType.ForcedInterrupt,
    AbilityType.ForcedReaction,
    AbilityType.Interrupt,
    AbilityType.Reaction,
    AbilityType.WouldInterrupt
]);
