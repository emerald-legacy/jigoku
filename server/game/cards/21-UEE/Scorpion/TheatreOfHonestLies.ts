import * as costs from '../../../costs/index.js';
import { draw } from '../../../GameActions/GameActions.js';
import { StrongholdCard } from '../../../StrongholdCard.js';

export default class TheatreOfHonestLies extends StrongholdCard {
    static id = 'theatre-of-honest-lies';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount > 0
            })
            .cost(costs.bowSelf())
            .gameAction(draw());

        this.reaction('Take 1 honor')
            .when({
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount > 0,
                onTransferHonor: (event, context) => event.player === context.player && event.amount > 0
            })
            .cost(costs.bowSelf())
            .takeHonor();
    }
}
