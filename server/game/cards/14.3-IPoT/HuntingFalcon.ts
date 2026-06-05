import DrawCard from '../../DrawCard.js';
import { CardType, EventName, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class HuntingFalcon extends DrawCard {
    static id = 'hunting-falcon';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at a province',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            },
            target: {
                location: Location.Provinces,
                cardType: CardType.Province,
                cardCondition: (card) => card.isFacedown(),
                gameAction: AbilityDsl.actions.lookAt(context => ({
                    message: '{0} sees {1} in {2}',
                    messageArgs: (cards) => [context.source, cards[0], cards[0].location]
                }))
            }
        });
    }
}


export default HuntingFalcon;
