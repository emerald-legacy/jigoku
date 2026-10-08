import DrawCard from '../../DrawCard.js';
import { Phase } from '../../Constants.js';
import { cardCannot } from '../../effects.js';

class DojiShizue extends DrawCard {
    static id = 'doji-shizue';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.game.currentPhase === Phase.Fate && context.player.imperialFavor !== '',
            effect: [
                cardCannot('removeFate'),
                cardCannot('discardFromPlay')
            ]
        });
    }
}


export default DojiShizue;
