import { CardType, EventName, Location } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

export default class BustlingAcademy extends DrawCard {
    static id = 'bustling-academy';

    public setupCardAbilities() {
        this.action({
            title: 'Discard a card in a province and refill it faceup',
            condition: (context) =>
                context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('scholar')) &&
                context.player.opponent !== undefined,
            target: {
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event],
                gameAction: AbilityDsl.actions.moveCard({ destination: Location.DynastyDiscardPile })
            },
            effect: 'discard {0} and refill it faceup',
            then: (context: AbilityContext) => ({
                gameAction: AbilityDsl.actions.refillFaceup(() => {
                    const moveEvent = context.events[0] as GameEvent<EventName.Unnamed> & { cardStateWhenMoved: DrawCard };
                    return {
                        target: moveEvent.cardStateWhenMoved.controller,
                        location: moveEvent.cardStateWhenMoved.location
                    };
                })
            })
        });
    }
}
