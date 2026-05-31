import { EventNames, Locations } from '../../Constants.js';
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
                onFateCollected: (event: EventPayload<EventNames.OnFateCollected>, context: any) => event.player === context.player
            },
            gameAction: AbilityDsl.actions.gainFate((context: any) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province: any) => province.location !== Locations.StrongholdProvince
                )
            }))
        });
    }
}
