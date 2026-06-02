import DrawCard from '../../../DrawCard.js';
import { CardType, EventName, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
class AshigaruCompany extends DrawCard {
    static id = 'ashigaru-company';

    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            },
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card: any) => card.hasTrait('follower') && card.type === CardType.Attachment,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}


export default AshigaruCompany;
