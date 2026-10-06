import DrawCard from '../../DrawCard.js';
import { Phases } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class RingOfBinding extends DrawCard {
    static id = 'ring-of-binding';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.game.currentPhase === Phases.Fate && context.player.firstPlayer,
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }
}


export default RingOfBinding;
