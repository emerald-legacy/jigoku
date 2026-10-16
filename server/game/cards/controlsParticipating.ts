import type { Trait } from '../Constants.js';
import type Player from '../Player.js';

/** "If you control a participating [trait] character." With several traits, any of them counts. */
export function controlsParticipating(player: Player, ...traits: Trait[]): boolean {
    return player.anyCardsInPlay((card) => card.isParticipating() && card.hasSomeTrait(...traits));
}
