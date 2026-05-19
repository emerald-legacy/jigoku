import DrawCard from '../../drawcard.js';
import { Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RingOfBinding extends DrawCard {
    static id = 'ring-of-binding';

    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.game.currentPhase === Phases.Fate && context.player.firstPlayer,
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}


export default RingOfBinding;
