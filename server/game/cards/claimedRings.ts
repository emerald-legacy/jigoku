import { elementTrait } from '../Constants.js';
import type BaseCard from '../BaseCard.js';
import type { ConflictType, Element } from '../Constants.js';
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

/** Whether the ring is claimed (by `player`, if given) as a ring of `type`. A ring only considered claimed (Secluded Shrine) has no type until a player claims it (ruling #666). */
export function isClaimedRingOfType(ring: Ring, type: ConflictType, player: Player | null = null): boolean {
    return ring.isConsideredClaimed(player) && ring.isClaimed() && ring.isConflictType(type);
}

/** Without `type`, rings only considered claimed count too (ruling #357). */
export function countClaimedRings(game: Game, type?: ConflictType): number {
    return Object.values(game.rings).filter((ring) => type ? isClaimedRingOfType(ring, type) : ring.isConsideredClaimed()).length;
}

/** Whether an `onClaimRing` event claims a ring with an element that is a trait of the player's role (a contested ring keeps its added elements until the claim's reactions are over). */
export function claimsRoleElement(player: Player, event: { ring: Ring }): boolean {
    const role = player.role;
    return !!role && event.ring.getElements().some((element) => role.hasTrait(elementTrait(element)));
}

/** Whether an `onClaimRing` event claims a ring with the element of the card's symbol `key`. */
export function claimsRingOf(card: BaseCard, key: string, event: { ring: Ring }): boolean {
    return event.ring.hasElement(card.getCurrentElementSymbol(key));
}

/** The printed 'Claimed Ring' element symbols of a card, for its `printedElementSymbols`. */
export function claimedRingSymbols(symbols: readonly ClaimedRingSymbol[]): ElementSymbolInfo[] {
    return symbols.map(({ key, element }) => ({ key, prettyName: 'Claimed Ring', element }));
}
