import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type Player from '../Player.js';
import Soldier from './Soldier.js';
import { attach } from '../GameActions/GameActions.js';

/** A check whether a Soldier could be attached to a character, made against a dummy Soldier owned by `owner`. */
export function soldierAttachCheck(owner: Player): (character: BaseCard, context: AbilityContext) => boolean {
    const dummy = Soldier.createDummy(owner);
    return (character, context) => attach({ attachment: dummy }).canAffect(character, context);
}
