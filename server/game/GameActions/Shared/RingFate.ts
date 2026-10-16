import { msg } from '../../GameChat.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { EventName, RestrictionType } from '../../Constants.js';
import type Ring from '../../Ring.js';

/** The ability's player takes all the fate on the ring, unless it is empty or they cannot take fate from rings. */
export function takeFateFromRing(ring: Ring, context: AbilityContext): void {
    const fate = ring.fate;
    if(fate <= 0 || !context.player.checkRestrictions(RestrictionType.TakeFateFromRings, context)) {
        return;
    }
    context.game.addMessage(msg`${context.player} takes ${fate} fate from ${ring}`);
    context.player.modifyFate(fate);
    ring.removeFate();
    context.game.raiseEvent(EventName.OnMoveFate, {
        fate: fate,
        origin: ring,
        context: context,
        recipient: context.player
    });
}
