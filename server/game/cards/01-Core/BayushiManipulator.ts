import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
export default class BayushiManipulator extends DrawCard {
    static id = 'bayushi-manipulator';

    public setupCardAbilities() {
        this.reaction({
            title: 'Increase bid by 1',
            when: { onHonorDialsRevealed: (event: EventPayload<EventNames.OnHonorDialsRevealed>) => event.isHonorBid },
            effect: 'increase their bid by 1',
            gameAction: AbilityDsl.actions.modifyBid()
        });
    }
}
