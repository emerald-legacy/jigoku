import { perRound } from '../../../AbilityLimit.js';
import { gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class TheStranger extends DrawCard {
    static id = 'the-stranger';

    setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                onClaimFavor: (event, context) => event.player === context.player
            })
            .gameAction(gainHonor())
            .limit(perRound(2));
    }
}
