import { perRound } from '../../AbilityLimit.js';
import { gainHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class WayOfTheChrysanthemum extends DrawCard {
    static id = 'way-of-the-chrysanthemum';

    setupCardAbilities() {
        this.reaction('Gain extra honor after bid')
            .when({
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.afterBid
            })
            .gameAction(gainHonor((context) => ({ amount: context.event.amount })))
            .max(perRound(1))
            .cannotBeMirrored();
    }
}


export default WayOfTheChrysanthemum;
