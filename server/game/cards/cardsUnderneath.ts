import { canPlayFromOutOfPlay, registerToPlayFromOutOfPlay } from '../effects.js';
import type BaseCard from '../BaseCard.js';
import { Location, Players, PlayType } from '../Constants.js';

/** Persistent-effect props that let `card`'s controller play the cards underneath it (those passing `match`) as if from hand. */
export function playableFromUnderneath(card: BaseCard, match: (underneath: BaseCard) => boolean = () => true) {
    return {
        location: Location.PlayArea,
        targetLocation: card.uuid,
        targetController: Players.Any,
        match: (underneath: BaseCard) => underneath.location === card.uuid && match(underneath),
        effect: [
            canPlayFromOutOfPlay((player) => player === card.controller, PlayType.PlayFromHand),
            registerToPlayFromOutOfPlay()
        ]
    };
}

/** Cards under `card`, whoever placed them or controls it now. */
export function countCardsUnderneath(card: BaseCard): number {
    return card.game.allCards.filter((underneath) => underneath.location === card.uuid).length;
}
