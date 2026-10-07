import { perRound } from '../../../AbilityLimit.js';
import { gainHonor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class AsahinaMomoko extends DrawCard {
    static id = 'asahina-momoko';

    setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('spell')
            })
            .gameAction(gainHonor())
            .limit(perRound(2));
    }
}
