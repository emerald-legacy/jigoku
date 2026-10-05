import type { Conflict } from '../Conflict.js';
import { CardType } from '../Constants.js';
import type Player from '../Player.js';

/** Whether the player is defending and has a faceup Kaiu Wall holding in a province of `conflict`. */
export function defendingAtKaiuWall(player: Player, conflict: Conflict | null): boolean {
    return player.isDefendingPlayer() && !!conflict && conflict.getConflictProvinces().some((province) =>
        player.getDynastyCardsInProvince(province.location).some((card) => card.isFaceup() && card.type === CardType.Holding && card.hasTrait('kaiu-wall'))
    );
}
