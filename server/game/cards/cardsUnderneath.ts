import { canPlayFromOutOfPlay, registerToPlayFromOutOfPlay } from '../effects.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { Location, Players, PlayType } from '../Constants.js';

/**
 * Persistent-effect props that let the controller of the card with the effect play the cards underneath it (those passing `match`)
 * as if from hand: the card itself, or one that copies or gained the ability.
 */
export function playableFromUnderneath(match: (underneath: BaseCard) => boolean = () => true) {
    return {
        location: Location.PlayArea,
        targetLocation: Location.Underneath,
        targetController: Players.Any,
        match: (underneath: BaseCard, context?: AbilityContext) => !!context && underneath.isUnderneath(context.source) && match(underneath),
        effect: [
            canPlayFromOutOfPlay((player, underneath) => player === underneath.host?.controller, PlayType.PlayFromHand),
            registerToPlayFromOutOfPlay()
        ]
    };
}

/** The cards under `card`, whoever placed them or controls it now. */
export function cardsUnderneath(card: BaseCard): BaseCard[] {
    return card.game.allCards.filter((underneath) => underneath.isUnderneath(card));
}

export function countCardsUnderneath(card: BaseCard): number {
    return cardsUnderneath(card).length;
}
