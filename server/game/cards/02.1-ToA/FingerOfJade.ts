import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class FingerOfJade extends DrawCard {
    static id = 'finger-of-jade';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context) => (event.cardTargets ?? []).some((card: any) => card === context.source.parent)
            },
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default FingerOfJade;
