import type { Conflict } from '../Conflict.js';
import type Player from '../Player.js';

/** Whether the player is attacking in `conflict` with a single character, which has `trait`. */
export function attacksAloneWithTrait(conflict: Conflict, player: Player, trait: string): boolean {
    return (
        player === conflict.attackingPlayer &&
        conflict.getNumberOfParticipantsFor(player) === 1 &&
        conflict.getParticipants((participant) => participant.hasTrait(trait) && participant.controller === player).length === 1
    );
}
