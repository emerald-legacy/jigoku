import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class BayushiManipulator extends DrawCard {
    static id = 'bayushi-manipulator';

    public setupCardAbilities() {
        this.reaction({
            title: 'Increase bid by 1',
            when: { onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>) => event.isHonorBid },
            effect: 'increase their bid by 1',
            gameAction: AbilityDsl.actions.modifyBid()
        });
    }
}
