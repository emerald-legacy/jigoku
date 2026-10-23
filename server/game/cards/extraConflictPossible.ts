import { EffectName } from '../Constants.js';
import type Player from '../Player.js';

/** An additional conflict changes nothing under a set conflict maximum (Waning Hostilities). */
export function extraConflictPossible(player: Player): boolean {
    return !player.anyEffect(EffectName.SetMaxConflicts);
}
