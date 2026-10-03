import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class ShinjoScout extends DrawCard {
    static id = 'shinjo-scout';

    setupCardAbilities() {
        this.reaction('Gain 1 fate')
            .when({
                onPassDuringDynasty: (event: EventPayload<EventName.OnPassDuringDynasty>, context) => event.player === context.player && event.firstToPass
            })
            .gameAction(AbilityDsl.actions.gainFate());
    }
}


export default ShinjoScout;
