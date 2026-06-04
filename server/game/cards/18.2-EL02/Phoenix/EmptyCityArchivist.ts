import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventName, Location } from '../../../Constants.js';

import type { AbilityContext } from '../../../AbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
class SearchTheArchives extends DrawCard {
    static id = 'empty-city-archivist';

    setupCardAbilities() {
        this.reaction({
            title: 'Search your deck for a card',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => event.card === context.source && event.originalLocation !== Location.PlayArea
            },
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 4,
                cardCondition: (card: DrawCard, context: AbilityContext) => {
                    const parent = (context.source as DrawCard).parent;
                    return card.hasTrait('spell') || card.hasTrait('kiho') || (!!parent && parent.hasTrait('scholar'));
                },
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            })
        });
    }
}


export default SearchTheArchives;
