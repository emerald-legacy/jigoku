import type { Conflict } from '../Conflict.js';
import type Player from '../Player.js';

export function attacksAloneWithTrait(conflict: Conflict, player: Player, trait: string): boolean {
    return (
        player === conflict.attackingPlayer &&
        conflict.getNumberOfParticipantsFor(player) === 1 &&
        conflict.getParticipants((participant) => participant.hasTrait(trait) && participant.controller === player).length === 1
    );
}
