import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { modifyBothSkills } from '../../effects.js';
import { msg } from '../../GameChat.js';

class ShibaTetsu extends DrawCard {
    static id = 'shiba-tetsu';

    setupCardAbilities() {
        this.reaction('Gain +1/+1')
            .when({
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('spell') && this.game.isDuringConflict()
            })
            .cardLastingEffect({ effect: modifyBothSkills(1) })
            .effect(() => msg`give him +1${'military'}/+1${'political'}`)
            .limit(unlimitedPerConflict());
    }
}


export default ShibaTetsu;
