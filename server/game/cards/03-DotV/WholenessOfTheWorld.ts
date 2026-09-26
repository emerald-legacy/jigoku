import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class WholenessOfTheWorld extends DrawCard {
    static id = 'wholeness-of-the-world';

    setupCardAbilities() {
        this.wouldInterrupt('Keep a claimed ring')
            .when({
                onReturnRing: (event: EventPayload<EventName.OnReturnRing>, context) => event.ring?.claimedBy === context.player.name
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('prevent {1} from returning to the unclaimed pool', context => context.event.ring ?? '')
            .max(AbilityDsl.limit.perRound(1))
            .cannotBeMirrored();
    }
}


export default WholenessOfTheWorld;
