import AbilityDsl from '../abilitydsl.js';
import type BaseCard from '../BaseCard.js';
import { Location, Players, PlayType } from '../Constants.js';

/** Persistent-effect props that let `card`'s controller play the cards underneath it (those passing `match`) as if from hand. */
export function playableFromUnderneath(card: BaseCard, match: (underneath: BaseCard) => boolean = () => true) {
    return {
        location: Location.PlayArea,
        targetLocation: card.uuid,
        targetController: Players.Self,
        match: (underneath: BaseCard) => underneath.location === card.uuid && match(underneath),
        effect: [
            AbilityDsl.effects.canPlayFromOutOfPlay((player) => player === card.controller, PlayType.PlayFromHand),
            AbilityDsl.effects.registerToPlayFromOutOfPlay()
        ]
    };
}

/** The number of cards underneath `card` that its controller controls. */
export function countCardsUnderneath(card: BaseCard): number {
    return card.game.allCards.filter((underneath) => underneath.controller === card.controller && underneath.location === card.uuid).length;
}
