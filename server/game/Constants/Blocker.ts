/** What `meetsRequirements` reports: the first thing that stops an ability or action from being initiated, or `None`. Listing one in `ignoredBlockers` skips that check. */
export enum Blocker {
    None = '',
    Blanked = 'blank',
    CannotInitiate = 'cannotInitiate',
    CannotPayCost = 'cost',
    CannotPlaceFate = 'restriction',
    CannotTrigger = 'cannotTrigger',
    ConditionNotMet = 'condition',
    DuplicateUnique = 'unique',
    Facedown = 'facedown',
    LimitedAlreadyPlayed = 'limited',
    LimitReached = 'limit',
    MaxReached = 'max',
    NoLegalTarget = 'target',
    TriggeringRestricted = 'triggeringRestrictions',
    WrongLocation = 'location',
    WrongPhase = 'phase',
    WrongPlayer = 'player',
    WrongProvince = 'province'
}
