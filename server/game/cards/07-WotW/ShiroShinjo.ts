import { EventName, Location } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class ShiroShinjo extends StrongholdCard {
    static id = 'shiro-shinjo';

    setupCardAbilities() {
        this.reaction({
            title: 'Collect additional fate',
            cost: AbilityDsl.costs.bowSelf(),
            when: {
                onFateCollected: (event: EventPayload<EventName.OnFateCollected>, context) => event.player === context.player
            },
            gameAction: AbilityDsl.actions.gainFate((context: AbilityContext) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province) => province.location !== Location.StrongholdProvince
                )
            }))
        });
    }
}
