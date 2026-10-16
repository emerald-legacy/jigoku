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
