import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class GallantQuartermaster extends DrawCard {
    static id = 'gallant-quartermaster';

    setupCardAbilities() {
        this.interrupt({
            title: 'Gain two fate',
            when: {
                onCardLeavesPlay: (event: EventPayload<EventNames.OnCardLeavesPlay>, context) => event.isSacrifice && event.card === context.source
            },
            gameAction: AbilityDsl.actions.gainFate({ amount: 2 })
        });
    }
}


export default GallantQuartermaster;
