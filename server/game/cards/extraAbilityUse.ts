import { Duration, EventName } from '../Constants.js';
import type { CardAbility } from '../CardAbility.js';

/** How long "trigger that ability an additional time this round (or specified period)" lasts: the ability's own limit period, or this round. */
export function getExtraUseDuration(ability: CardAbility | undefined): Duration {
    const resetEvents = ability?.limit?.getResetEvents() ?? new Set();
    if(resetEvents.has(EventName.OnConflictFinished)) {
        return Duration.UntilEndOfConflict;
    }
    if(resetEvents.has(EventName.OnPhaseEnded)) {
        return Duration.UntilEndOfPhase;
    }
    return Duration.UntilEndOfRound;
}
