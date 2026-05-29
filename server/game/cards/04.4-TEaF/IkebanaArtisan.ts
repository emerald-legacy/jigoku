import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import { EventNames } from '../../Constants.js';
class IkebanaArtisan extends DrawCard {
    static id = 'ikebana-artisan';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Lose fate instead of honor',
            when: {
                onModifyHonor: (event: EventPayload<EventNames.OnModifyHonor>, context) => event.dueToUnopposed && event.player === context.player
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'lose 1 fate rather than 1 honor for not defending the conflict',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.loseFate(context => ({ target: context.player }))
            ])
        });
    }
}


export default IkebanaArtisan;
