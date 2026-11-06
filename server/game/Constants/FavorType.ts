import { ConflictType } from './ConflictType.js';

export enum FavorType {
    Military = 'military',
    Political = 'political',
    Both = 'both'
}

/** Whether a player holding `favor` ('' for none) gets the favor's bonus in a conflict of this type. */
export function favorAppliesTo(favor: FavorType | '', conflictType: ConflictType | undefined): boolean {
    return favor === FavorType.Both ||
        (favor === FavorType.Military && conflictType === ConflictType.Military) ||
        (favor === FavorType.Political && conflictType === ConflictType.Political);
}
