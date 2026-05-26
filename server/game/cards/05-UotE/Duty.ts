import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventNames, Stages } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class Duty extends DrawCard {
    static id = 'duty';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event: EventPayload<EventNames.OnModifyHonor>, context: AbilityContext) =>
                    event.player === context.player && -(event.amount ?? 0) >= context.player.honor && event.context?.stage === Stages.Effect,
                onTransferHonor: (event: EventPayload<EventNames.OnTransferHonor>, context: AbilityContext) =>
                    event.player === context.player && (event.amount ?? 0) >= context.player.honor && event.context?.stage === Stages.Effect
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
