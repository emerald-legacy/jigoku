import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Location } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import type Player from '../Player.js';
import Soldier from './Soldier.js';
import { attach } from '../GameActions/GameActions.js';

/** Puts the top card of the player's conflict deck into play facedown, attached to `character` as a +1/+1 Follower. */
export function attachTopConflictCardAsSoldier(context: AbilityContext, character: BaseCard | undefined): void {
    const card = context.player.conflictDeck[0];
    const token = context.game.createToken(card, Soldier);
    card.owner.removeCardFromPile(card);
    card.moveTo(Location.RemovedFromGame);
    const moveEvents: Event[] = [];
    attach({ target: character, attachment: token }).addEventsToArray(moveEvents, context);
    context.game.openThenEventWindow(moveEvents);
}

/** A check whether a Soldier could be attached to a character, made against a dummy Soldier owned by `owner`. */
export function soldierAttachCheck(owner: Player): (character: BaseCard, context: AbilityContext) => boolean {
    const dummy = Soldier.createDummy(owner);
    return (character, context) => attach({ attachment: dummy }).canAffect(character, context);
}
