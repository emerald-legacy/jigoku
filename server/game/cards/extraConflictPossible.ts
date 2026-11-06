import { EffectName } from '../Constants.js';
import type Player from '../Player.js';

/**
 * An additional conflict changes nothing under a set conflict maximum (Waning Hostilities)
 * or once a declared-conflict maximum is reached (Privileged Position).
 */
export function extraConflictPossible(player: Player): boolean {
    return !player.anyEffect(EffectName.SetMaxConflicts) && !player.conflictManager.declaredConflictCapReached();
}
