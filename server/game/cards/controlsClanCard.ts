import { CardType, Location } from '../Constants.js';
import type Player from '../Player.js';
import type { Faction } from '../Constants.js';

/** "If you control a [clan] card": in play are characters and attachments, the stronghold, faceup provinces and the holdings in them. */
export function controlsClanCard(player: Player, clan: Faction): boolean {
    return player.game.allCards.some((card) => card.controller === player && card.isFaction(clan) && card.isFaceup() && (
        card.location === Location.PlayArea || card.type === CardType.Stronghold || card.isProvinceCard() ||
        (card.isInProvince() && card.type === CardType.Holding)
    ));
}
