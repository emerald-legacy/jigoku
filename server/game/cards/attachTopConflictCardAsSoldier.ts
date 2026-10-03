import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Location } from '../Constants.js';
import type { Event } from '../Events/Event.js';
import Soldier from './Soldier.js';

/** Puts the top card of the player's conflict deck into play facedown, attached to `character` as a +1/+1 Follower. */
export function attachTopConflictCardAsSoldier(context: AbilityContext, character: BaseCard | undefined): void {
    const card = context.player.conflictDeck[0];
    const token = context.game.createToken(card, Soldier);
    card.owner.removeCardFromPile(card);
    card.moveTo(Location.RemovedFromGame);
    const moveEvents: Event[] = [];
    context.game.actions.attach({ target: character, attachment: token }).addEventsToArray(moveEvents, context);
    context.game.openThenEventWindow(moveEvents);
}
