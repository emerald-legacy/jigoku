export enum AbilityTypes {
    Action = 'action',
    WouldInterrupt = 'cancelinterrupt',
    ForcedInterrupt = 'forcedinterrupt',
    KeywordInterrupt = 'keywordinterrupt',
    Interrupt = 'interrupt',
    KeywordReaction = 'keywordreaction',
    ForcedReaction = 'forcedreaction',
    Reaction = 'reaction',
    DuelReaction = 'duelreaction', // ONLY USE FOR DUEL CHALLENGE, FOCUS, AND STRIKE
    Persistent = 'persistent',
    OtherEffects = 'OtherEffects'
}
