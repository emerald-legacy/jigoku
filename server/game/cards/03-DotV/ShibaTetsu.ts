import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class ShibaTetsu extends DrawCard {
    static id = 'shiba-tetsu';

    override setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait(Trait.Spell) && this.game.isDuringConflict()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .chatText(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimited());
    }
}


export default ShibaTetsu;
