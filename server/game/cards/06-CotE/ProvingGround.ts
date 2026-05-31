import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class ProvingGround extends DrawCard {
    static id = 'proving-ground';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Draw a card after winning a duel',
            when: {
                afterDuel: (event: EventPayload<EventNames.AfterDuel>, context: any) => {
                    if(!event.winner) {
                        return false;
                    }
                    return event.winner.some((card) => card.controller === context.player);
                }
            },
            gameAction: ability.actions.draw(),
            limit: ability.limit.perRound(2)
        });
    }
}


export default ProvingGround;
