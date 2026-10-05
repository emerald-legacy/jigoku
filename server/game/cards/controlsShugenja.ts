import { CardType } from '../Constants.js';
import type Player from '../Player.js';

/** "Play only if you control a Shugenja character." */
export function controlsShugenja(player: Player): boolean {
    return player.cardsInPlay.some((card) => card.getType() === CardType.Character && card.hasTrait('shugenja'));
}
