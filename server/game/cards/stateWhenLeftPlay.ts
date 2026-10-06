import type { AbilityContext } from '../AbilityContext.js';
import { EventName } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

/** The card that left play in the step before, as it was then (with its tokens and fate). */
export function stateWhenLeftPlay(context: AbilityContext): DrawCard | undefined {
    for(const event of context.previousEvents) {
        if(event.is(EventName.OnCardLeavesPlay)) {
            return event.cardStateWhenLeftPlay;
        }
    }
    return undefined;
}
