import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class SinisterPeacekeeper extends DrawCard {
    static id = 'sinister-peacekeeper';

    setupCardAbilities() {
        this.reaction({
            title: 'Make opponent lose an honor',
            when: {
                onModifyHonor: (event: EventPayload<EventNames.OnModifyHonor>, context: any) =>
                    (event.amount ?? 0) > 0 && context.player.opponent &&
                    event.player === context.player.opponent,
                onTransferHonor: (event: EventPayload<EventNames.OnTransferHonor>, context: any) => event.player === context.player && (event.amount ?? 0) > 0
            },
            gameAction: AbilityDsl.actions.loseHonor((context: AbilityContext) => ({
                target: context.player.opponent
            }))
        });
    }
}


export default SinisterPeacekeeper;
