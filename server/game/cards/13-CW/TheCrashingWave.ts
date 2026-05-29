import DrawCard from '../../DrawCard.js';
import { CardTypes, EventNames, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

class TheCrashingWave extends DrawCard {
    static id = 'the-crashing-wave';

    setupCardAbilities() {
        this.reaction({
            title: 'Move the conflict',
            when: {
                onTheCrashingWave: (event: EventPayload<EventNames.OnTheCrashingWave>, context) => event.conflict.defendingPlayer === context.player
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}


export default TheCrashingWave;
