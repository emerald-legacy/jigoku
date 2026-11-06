import type { AbilityContext } from '../../AbilityContext.js';
import { RestrictionType } from '../../Constants.js';
import type DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type Ring from '../../Ring.js';

/**
 * Whether fate can move away from `origin` (none: new fate from the general token pool). It needs fate; a card must not be
 * restricted from losing fate (Student of War), and a ring needs the player to be allowed to take fate from rings (The Stone of Sorrows).
 * `spend` is for texts and costs that spend fate from a fate pool: the player must be allowed to spend it (Blood of Onnotangu).
 */
export function canMoveFateFrom(origin: DrawCard | Player | Ring | undefined, context: AbilityContext, { spend = false } = {}): boolean {
    if(!origin) {
        return true;
    }
    if(origin.getFate() === 0) {
        return false;
    }
    if(origin.isRing()) {
        return context.player.checkRestrictions(RestrictionType.TakeFateFromRings, context);
    }
    if(origin.isCard()) {
        return origin.checkRestrictions(RestrictionType.RemoveFate, context);
    }
    return !spend || origin.canSpendFate(1, context);
}
