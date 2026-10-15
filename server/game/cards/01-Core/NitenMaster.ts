import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { perRound } from '../../AbilityLimit.js';

class NitenMaster extends DrawCard {
    static id = 'niten-master';

    setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onCardAttached: (event, context) => (
                    event.parent === context.source &&
                    event.card.hasTrait(Trait.Weapon) &&
                    event.card.controller === context.player
                )
            })
            .ready()
            .limit(perRound(2));
    }
}


export default NitenMaster;
