import { Locations } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShiroShinjo extends StrongholdCard {
    static id = 'shiro-shinjo';

    setupCardAbilities() {
        this.reaction({
            title: 'Collect additional fate',
            cost: AbilityDsl.costs.bowSelf(),
            when: {
                onFateCollected: (event, context) => event.player === context.player
            },
            gameAction: AbilityDsl.actions.gainFate((context) => ({
                amount: context.player.getNumberOfOpponentsFaceupProvinces(
                    (province) => province.location !== Locations.StrongholdProvince
                )
            }))
        });
    }
}
