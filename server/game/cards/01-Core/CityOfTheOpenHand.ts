import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';

export default class CityOfTheOpenHand extends StrongholdCard {
    static id = 'city-of-the-open-hand';

    setupCardAbilities() {
        this.action('Gain an honor')
            .cost(costs.bowSelf())
            .condition((context) => !!(context.player.opponent && context.player.isLessHonorable()))
            .gainHonor();
    }

    //Needed for testing some cards
    loadOriginalAction() {
        this.abilities.actions = [];
        this.declareAbilities(() => {
            this.action('Steal an honor')
                .cost(costs.bowSelf())
                .condition((context) => !!(context.player.opponent && context.player.isLessHonorable()))
                .takeHonor();
        });
    }
}
