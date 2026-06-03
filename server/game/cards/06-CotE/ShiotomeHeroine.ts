import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { EventName, Stage } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ShiotomeHeroine extends DrawCard {
    static id = 'shiotome-heroine';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready this character',
            when: {
                onModifyHonor: (event: EventPayload<EventName.OnModifyHonor>, context: any) =>
                    (event.amount ?? 0) > 0 && context.player.opponent &&
                    event.player === context.player.opponent && event.context?.stage === Stage.Effect
            },
            gameAction: AbilityDsl.actions.ready()
        });
    }
}


export default ShiotomeHeroine;
