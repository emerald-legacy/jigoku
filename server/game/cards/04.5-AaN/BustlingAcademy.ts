import { CardType, EventName, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class BustlingAcademy extends DrawCard {
    static id = 'bustling-academy';

    public setupCardAbilities() {
        this.action('Discard a card in a province and refill it faceup')
            .condition((context) =>
                context.player.cardsInPlay.some((card: DrawCard) => card.hasTrait('scholar')) &&
                context.player.opponent !== undefined)
            .target('target', {
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, AbilityDsl.actions.moveCard({ destination: Location.DynastyDiscardPile }))
            .effect('discard {0} and refill it faceup')
            .then((context) => ({
                gameAction: AbilityDsl.actions.refillFaceup(() => {
                    const moveEvent = context.events[0];
                    const discarded = moveEvent.is(EventName.Unnamed) ? moveEvent.cardStateWhenMoved : undefined;
                    return discarded
                        ? { target: discarded.controller, location: discarded.location }
                        : { target: [], location: [] };
                })
            }));
    }
}
