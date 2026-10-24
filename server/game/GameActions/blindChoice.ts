import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type { BaseCardSelector } from '../CardSelectors/BaseCardSelector.js';
import { Location } from '../Constants.js';
import type Player from '../Player.js';
import { shuffle } from '../utils/random.js';

const hiddenLocations = [Location.Hand, Location.ConflictDeck, Location.DynastyDeck];

/**
 * Hantei XXXVIII makes another player's choices but sees none of their hidden zones (ruling #926).
 * Whether `chooser` takes over a choice among `cards` that are all hidden from him: he then chooses blindly.
 */
export function isBlindChoice(context: AbilityContext, cards: BaseCard[], chooser: Player | null = context.choosingPlayerOverride): boolean {
    return !!chooser && cards.length > 0 && cards.every((card) => card.controller !== chooser && hiddenLocations.includes(card.location));
}

/** A blind choice: `amount` cards at random, or none when the cards must have certain properties (`restricted`). */
export function chooseBlindly<Card>(cards: Card[], amount: number, restricted: boolean): Card[] {
    return restricted ? [] : shuffle(cards).slice(0, amount);
}

/** A blind choice of as many random cards as the selector takes. */
export function selectBlindly(selector: BaseCardSelector, cards: BaseCard[], context: AbilityContext, restricted: boolean): BaseCard[] {
    const chosen: BaseCard[] = [];
    for(const card of restricted ? [] : shuffle(cards)) {
        if(selector.hasReachedLimit(chosen, context)) {
            break;
        }
        if(!selector.wouldExceedLimit(chosen, card)) {
            chosen.push(card);
        }
    }
    return chosen;
}
