import { Trait } from '../Constants.js';
import type Player from '../Player.js';

/** "Play only if you control a Shugenja character." */
export function controlsShugenja(player: Player): boolean {
    return player.charactersInPlay.some((card) => card.hasTrait(Trait.Shugenja));
}
