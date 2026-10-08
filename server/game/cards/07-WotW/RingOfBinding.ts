import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class RingOfBinding extends DrawCard {
    static id = 'ring-of-binding';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.game.currentPhase === Phase.Fate && context.player.firstPlayer,
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }
}


export default RingOfBinding;
