import DrawCard from '../../DrawCard.js';
import { EventName, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ElegantTessen extends DrawCard {
    static id = 'elegant-tessen';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardAttached: (event: EventPayload<EventName.OnCardAttached>, context) => (
                    context.source.parent && event.card === context.source && context.source.parent.getCost() <= 2 &&
                    event.originalLocation !== Location.PlayArea
                )
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}


export default ElegantTessen;
