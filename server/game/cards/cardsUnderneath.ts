import { canPlayFromOutOfPlay, registerToPlayFromOutOfPlay } from '../effects.js';
import type BaseCard from '../BaseCard.js';
import { Location, Players, PlayType } from '../Constants.js';

/** Persistent-effect props that let `card`'s controller play the cards underneath it (those passing `match`) as if from hand. */
export function playableFromUnderneath(card: BaseCard, match: (underneath: BaseCard) => boolean = () => true) {
    return {
        location: Location.PlayArea,
        targetLocation: Location.Underneath,
        targetController: Players.Any,
        match: (underneath: BaseCard) => underneath.isUnderneath(card) && match(underneath),
        effect: [
            canPlayFromOutOfPlay((player) => player === card.controller, PlayType.PlayFromHand),
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
