import DrawCard from '../../DrawCard.js';
import { Phase, RestrictionType } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class RingOfBinding extends DrawCard {
    static id = 'ring-of-binding';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.game.currentPhase === Phase.Fate && context.player.firstPlayer,
            effect: [
                cardCannot(RestrictionType.RemoveFate),
                cardCannot(RestrictionType.DiscardFromPlay)
            ]
        });
    }
}


export default RingOfBinding;
