import type Player from '../Player.js';

export function participatingGlory(player: Player): number {
    return player.cardsInPlay.reduce((total, card) => total + (card.isParticipating() && !card.bowed ? card.glory : 0), 0);
}

export function hasMoreParticipatingGlory(player: Player): boolean {
    return !!player.opponent && participatingGlory(player) > participatingGlory(player.opponent);
}
