import { Location } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';

export default class ShiroShinjo extends StrongholdCard {
    static id = 'shiro-shinjo';

    setupCardAbilities() {
        this.reaction('Collect additional fate')
            .when({
                onFateCollected: (event, context) => event.player === context.player
            })
            .cost(costs.bowSelf())
            .gainFate((context) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province) => province.location !== Location.StrongholdProvince
                )
            }));
    }
}
