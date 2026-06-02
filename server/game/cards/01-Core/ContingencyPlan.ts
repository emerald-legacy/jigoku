import { Direction } from '../../GameActions/ModifyBidAction.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
export default class ContingencyPlan extends DrawCard {
    static id = 'contingency-plan';

    public setupCardAbilities() {
        this.reaction({
            title: 'Change your bid by 1',
            when: { onHonorDialsRevealed: (event: EventPayload<EventName.OnHonorDialsRevealed>) => event.isHonorBid },
            gameAction: AbilityDsl.actions.modifyBid({ direction: Direction.Prompt })
        });
    }
}
