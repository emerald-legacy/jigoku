import DrawCard from '../../drawcard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class WayOfTheChrysanthemum extends DrawCard {
    static id = 'way-of-the-chrysanthemum';

    setupCardAbilities(ability: any) {
        this.reaction({
            title: 'Gain extra honor after bid',
            max: ability.limit.perRound(1),
            when: {
                onTransferHonor: (event: EventPayload<EventNames.OnTransferHonor>, context: any) => event.player === context.player.opponent && event.afterBid
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.gainHonor((context: any) => ({ amount: context.event.amount }))
        });
    }
}


export default WayOfTheChrysanthemum;
