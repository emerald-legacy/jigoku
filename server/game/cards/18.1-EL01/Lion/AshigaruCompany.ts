import DrawCard from '../../../DrawCard.js';
import { CardTypes, EventNames, Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
class AshigaruCompany extends DrawCard {
    static id = 'ashigaru-company';

    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: {
                onCardAttached: (event: EventPayload<EventNames.OnCardAttached>, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            effect: 'look at the top five cards of their deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                cardCondition: (card: any) => card.hasTrait('follower') && card.type === CardTypes.Attachment,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                }),
                shuffle: false,
                placeOnBottomInRandomOrder: true
            })
        });
    }
}


export default AshigaruCompany;
