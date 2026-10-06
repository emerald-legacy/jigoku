import { Location } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { gainFate } from '../../GameActions/GameActions.js';

export default class ShiroShinjo extends StrongholdCard {
    static id = 'shiro-shinjo';

    setupCardAbilities() {
        this.reaction('Collect additional fate')
            .when({
                onFateCollected: (event, context) => event.player === context.player
            })
            .cost(AbilityDsl.costs.bowSelf())
            .gameAction(gainFate((context) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province) => province.location !== Location.StrongholdProvince
                )
            })));
    }
}
