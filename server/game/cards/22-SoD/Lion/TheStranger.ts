import AbilityDsl from '../../../abilitydsl.js';
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
            .limit(AbilityDsl.limit.perRound(2));
    }
}
