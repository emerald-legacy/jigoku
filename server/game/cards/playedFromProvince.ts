import { CardType, type Location } from '../Constants.js';
import type BaseCard from '../BaseCard.js';

/** In the province at `location`, or hidden in a holding there (Back-Alley Hideaway plays it as if from that province). */
export function isPlayedFromProvince(card: BaseCard, location: Location): boolean {
    const parent = card.parent;
    return card.location === location ||
        (!!parent && 'location' in parent && parent.type === CardType.Holding && parent.location === location);
}
