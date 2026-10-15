import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';

export default class CityOfTheOpenHand extends StrongholdCard {
    static id = 'city-of-the-open-hand';

    setupCardAbilities() {
        this.action('Gain an honor')
            .condition((context) => !!(context.player.opponent && context.player.isLessHonorable()))
            .cost(costs.bowSelf())
            .gainHonor();
    }

    //Needed for testing some cards
    loadOriginalAction() {
        this.abilities.actions = [];
        this.declareAbilities(() => {
            this.action('Steal an honor')
                .condition((context) => !!(context.player.opponent && context.player.isLessHonorable()))
                .cost(costs.bowSelf())
                .takeHonor();
        });
    }
}
