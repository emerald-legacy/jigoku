import type Player from '../Player.js';

/** The total glory of the player's participating unbowed characters. */
export function participatingGlory(player: Player): number {
    return player.cardsInPlay.reduce((total, card) => total + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0);
}

/** Whether the player has an opponent and more participating unbowed glory than them. */
export function hasMoreParticipatingGlory(player: Player): boolean {
    return !!player.opponent && participatingGlory(player) > participatingGlory(player.opponent);
}
