import { Trait } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class AsahinaMomoko extends DrawCard {
    static id = 'asahina-momoko';

    override setupCardAbilities() {
        this.reaction('Gain 1 honor')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait(Trait.Spell)
            })
            .gainHonor()
            .limit(perRound(2));
    }
}
