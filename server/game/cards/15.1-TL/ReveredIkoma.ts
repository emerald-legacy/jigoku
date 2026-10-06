import DrawCard from '../../DrawCard.js';
import { cannotReceiveDishonorToken } from '../../effects.js';
import { gainFate } from '../../GameActions/GameActions.js';

class ReveredIkoma extends DrawCard {
    static id = 'revered-ikoma';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card === context?.source,
            effect: cannotReceiveDishonorToken()
        });

        this.action('Gain 1 fate')
            .condition(context => context.player.honorGained(context.game.roundNumber, this.game.currentPhase, true) >= 2)
            .gameAction(gainFate());
    }
}


export default ReveredIkoma;
