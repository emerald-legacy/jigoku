import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Stage } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Duty extends DrawCard {
    static id = 'duty';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event: EventPayload<EventName.OnModifyHonor>, context: AbilityContext) =>
                    event.player === context.player && -(event.amount ?? 0) >= context.player.honor && event.context?.stage === Stage.Effect,
                onTransferHonor: (event: EventPayload<EventName.OnTransferHonor>, context: AbilityContext) =>
                    event.player === context.player && (event.amount ?? 0) >= context.player.honor && event.context?.stage === Stage.Effect
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor((context: AbilityContext) => ({ target: context.player }))
            ])
        });
    }
}


export default Duty;
