import type AbilityDsl from '../../abilitydsl.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventName } from '../../Constants.js';
class WayOfTheChrysanthemum extends DrawCard {
    static id = 'way-of-the-chrysanthemum';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain extra honor after bid',
            max: ability.limit.perRound(1),
            when: {
                onTransferHonor: (event: EventPayload<EventName.OnTransferHonor>, context: TriggeredAbilityContext) => event.player === context.player.opponent && event.afterBid
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.gainHonor((context: AbilityContext) => ({ amount: (context as TriggeredAbilityContext).event.amount }))
        });
    }
}


export default WayOfTheChrysanthemum;
