import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';

/** How many of `cards` can be targeted together, taking each card that can be targeted alongside the ones before it. */
export function countTargetable(cards: BaseCard[], context: AbilityContext): number {
    const selectedCards: BaseCard[] = [];
    for(const card of cards) {
        if(card.canBeTargeted(context, selectedCards)) {
            selectedCards.push(card);
        }
    }
    return selectedCards.length;
}
