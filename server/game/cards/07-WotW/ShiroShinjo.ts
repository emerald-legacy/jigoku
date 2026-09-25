import { EventName, Location } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class ShiroShinjo extends StrongholdCard {
    static id = 'shiro-shinjo';

    setupCardAbilities() {
        this.reaction('Collect additional fate')
            .when({
                onFateCollected: (event: EventPayload<EventName.OnFateCollected>, context) => event.player === context.player
            })
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(AbilityDsl.actions.gainFate((context) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province) => province.location !== Location.StrongholdProvince
                )
            })));
    }
}
