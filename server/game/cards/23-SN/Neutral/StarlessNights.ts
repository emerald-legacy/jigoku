import DrawCard from '../../../DrawCard.js';
import { perRound } from '../../../AbilityLimit.js';
import { placeFateOnRing } from '../../../GameActions/GameActions.js';
import { Phases } from '../../../Constants.js';

export default class StarlessNights extends DrawCard {
    static id = 'starless-nights';

    setupCardAbilities() {
        this.reaction('Place 1 fate on each unclaimed ring')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .gameAction(placeFateOnRing((context) => ({
                target: Object.values(context.game.rings).filter(ring => ring.isUnclaimed())
            })))
            .max(perRound(1));
    }
}
