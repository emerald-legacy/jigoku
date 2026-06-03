import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class ThePathOfMan extends DrawCard {
    static id = 'the-path-of-man';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                afterConflict: (event: EventPayload<EventName.AfterConflict>, context) => event.conflict.winner === context.player && (event.conflict.skillDifference ?? 0) >= 5
            },
            gameAction: ability.actions.gainFate({ amount: 2 })
        });
    }
}


export default ThePathOfMan;
