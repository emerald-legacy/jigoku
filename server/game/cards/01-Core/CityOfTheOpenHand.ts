import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';

export default class CityOfTheOpenHand extends StrongholdCard {
    static id = 'city-of-the-open-hand';

    override setupCardAbilities() {
        this.action('Gain an honor')
            .condition((context) => !!(context.player.opponent && context.player.isLessHonorable()))
            .cost(costs.bowSelf())
            .gainHonor();
    }
}
