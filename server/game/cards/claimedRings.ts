import type BaseCard from '../BaseCard.js';
import type { Conflict } from '../Conflict.js';
import type { Element } from '../Constants.js';
import type { ElementSymbolInfo } from '../ElementSymbol.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';

type ClaimedRingSymbol = { key: string; element: Element };

/** Whether the player has claimed the ring of the card's element symbol `key`. */
export function hasClaimedRing(card: BaseCard, key: string, player: Player): boolean {
    return card.game.rings[card.getCurrentElementSymbol(key)].isConsideredClaimed(player);
}

/** Whether any player has claimed the ring of the card's element symbol `key`. */
export function isRingClaimed(card: BaseCard, key: string): boolean {
    return card.game.rings[card.getCurrentElementSymbol(key)].isConsideredClaimed();
}

/** Whether the player has claimed the ring of any of the card's `symbols`, checked in order. */
export function hasClaimedAnyRing(card: BaseCard, symbols: readonly ClaimedRingSymbol[], player: Player): boolean {
    return symbols.some(({ key }) => hasClaimedRing(card, key, player));
}

/** The number of claimed rings, optionally only those matching `predicate`. */
export function countClaimedRings(game: Game, predicate: (ring: Ring) => boolean = () => true): number {
    return Object.values(game.rings).filter((ring) => ring.isConsideredClaimed() && predicate(ring)).length;
}

/** Whether an `onClaimRing` event claims an element that is a trait of the player's role, through the conflict's ring or the claimed ring. */
export function claimsRoleElement(player: Player, event: { ring: Ring; conflict?: Conflict }): boolean {
    const role = player.role;
    return !!role && (!!event.conflict?.elements.some((element) => role.hasTrait(element)) || role.hasTrait(event.ring.element));
}

/** Whether an `onClaimRing` event claims the element of the card's symbol `key`, through the conflict's ring or the claimed ring. */
export function claimsRingOf(card: BaseCard, key: string, event: { ring: Ring; conflict?: Conflict }): boolean {
    const element = card.getCurrentElementSymbol(key);
    return !!event.conflict?.hasElement(element) || event.ring.hasElement(element);
}

/** The printed 'Claimed Ring' symbols, new on each call because a replaced element is written into them. */
export function claimedRingSymbols(symbols: readonly ClaimedRingSymbol[]): ElementSymbolInfo[] {
    return symbols.map(({ key, element }) => ({ key, prettyName: 'Claimed Ring', element }));
}
