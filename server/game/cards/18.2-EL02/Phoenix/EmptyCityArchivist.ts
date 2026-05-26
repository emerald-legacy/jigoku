import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventNames, Locations } from '../../../Constants.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
class SearchTheArchives extends DrawCard {
    static id = 'empty-city-archivist';

    setupCardAbilities() {
        this.reaction({
            title: 'Search your deck for a card',
            when: {
                onCardAttached: (event: EventPayload<EventNames.OnCardAttached>, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                cardCondition: (card: any, context: any) => card.hasTrait('spell') || card.hasTrait('kiho') || (context.source.parent && context.source.parent.hasTrait('scholar')),
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}


export default SearchTheArchives;
