import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import { EventName } from '../../Constants.js';
class ProvingGround extends DrawCard {
    static id = 'proving-ground';

    setupCardAbilities() {
        this.reaction('Draw a card after winning a duel')
            .when({
                afterDuel: (event: EventPayload<EventName.AfterDuel>, context: TriggeredAbilityContext) => {
                    if(!event.winner) {
                        return false;
                    }
                    return event.winner.some((card) => card.controller === context.player);
                }
            })
            .gameAction(AbilityDsl.actions.draw())
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default ProvingGround;
