import { CardType, Trait } from '../Constants.js';
import type Player from '../Player.js';

/** "Play only if you control a Shugenja character." */
export function controlsShugenja(player: Player): boolean {
    return player.cardsInPlay.some((card) => card.type === CardType.Character && card.hasTrait(Trait.Shugenja));
}
